import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { CommentsTree } from './models/comments-tree.model';
import { Comment } from './models/comment.model';
import { UsersService } from '../users/users.service';
import { ArticlesService } from '../articles/articles.service';
import { User } from '../users/models/user.model';
import { FindOptions } from 'sequelize/types/model';
import sequelize, { Op } from 'sequelize';

@Injectable()
export class CommentsService {
  public constructor(
    @InjectModel(Comment) private commentRepository: typeof Comment,
    @InjectModel(CommentsTree) private treeRepository: typeof CommentsTree,
    private usersService: UsersService,
    private articlesService: ArticlesService,
  ) {}

  public async createComment(createCommentDto: CreateCommentDto) {
    if (
      !createCommentDto.content ||
      !createCommentDto.articleId ||
      !createCommentDto.userId ||
      !createCommentDto.level ||
      !(
        createCommentDto.parentCommentId ||
        createCommentDto.parentCommentId === 0
      )
    ) {
      throw new BadRequestException({ message: 'Comment is not created 1' });
    }

    const user = await this.usersService.getUserById(createCommentDto.userId);
    const article = await this.articlesService.getArticleById(
      createCommentDto.articleId,
    );
    if (!user || !article) {
      throw new BadRequestException({ message: 'Comment is not created 2' });
    }

    const comment = await this.commentRepository.create({
      content: createCommentDto.content,
      userId: createCommentDto.userId,
    });

    const ancestors = await this.commentRepository.findAll({
      include: {
        model: CommentsTree,
        as: 'descendantsList',
        where: {
          descendantId: createCommentDto.parentCommentId,
        },
      },
    });
    ancestors.push(comment);

    for (const ancestor of ancestors) {
      await this.treeRepository.create({
        ancestorId: ancestor.id,
        nearestAncestorId: createCommentDto.parentCommentId,
        descendantId: comment.id,
        level: createCommentDto.level,
        articleId: createCommentDto.articleId,
      });
    }

    return this.getCommentById(comment.id, {
      include: [
        {
          association: 'user',
          model: User,
        },
      ],
    });
  }

  public async getCommentById(
    id: number,
    options?: Omit<FindOptions<Comment>, 'where'>,
  ) {
    const comment = await this.commentRepository.findByPk(id, options);
    if (comment) {
      return comment;
    }
    throw new NotFoundException({ message: 'Comment not found' });
  }

  public async removeComment(id: number) {
    const comment = await this.getCommentById(id);
    if (comment) {
      await this.commentRepository.destroy({ where: { id } });
      return;
    }
    throw new NotFoundException({ message: 'Comment not found' });
  }

  public async getAllComments(articleId: number) {
    const comments = await this.commentRepository.findAll({
      attributes: ['id', 'content', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          association: 'user',
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: CommentsTree,
          as: 'descendantsList',
          attributes: ['descendantId', 'nearestAncestorId', 'level'],
          where: {
            articleId: articleId,
            ancestorId: {
              [Op.or]: [
                {
                  [Op.eq]: sequelize.col('nearest_ancestor_id'),
                },
                {
                  [Op.eq]: sequelize.col('descendant_id'),
                },
              ],
            },
          },
        },
      ],
      order: [['id', 'ASC']],
    });
    return comments;
  }
}
