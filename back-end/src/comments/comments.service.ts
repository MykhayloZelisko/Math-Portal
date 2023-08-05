import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
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
import { JwtService } from '@nestjs/jwt';
import { UpdateLikeDislikeDto } from './dto/update-like-dislike.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  public constructor(
    @InjectModel(Comment) private commentRepository: typeof Comment,
    @InjectModel(CommentsTree) private treeRepository: typeof CommentsTree,
    private usersService: UsersService,
    @Inject(forwardRef(() => ArticlesService))
    private articlesService: ArticlesService,
    private jwtService: JwtService,
  ) {}

  public async createComment(
    createCommentDto: CreateCommentDto,
    token: string,
  ) {
    if (
      !createCommentDto.content ||
      !createCommentDto.articleId ||
      !createCommentDto.level ||
      !(
        createCommentDto.parentCommentId ||
        createCommentDto.parentCommentId === 0
      )
    ) {
      throw new BadRequestException({ message: 'Comment is not created' });
    }

    const userByToken = await this.jwtService.verifyAsync(token);
    const user = await this.usersService.getUserById(userByToken.id);
    const article = await this.articlesService.getArticleById(
      createCommentDto.articleId,
    );
    if (!user || !article) {
      throw new BadRequestException({ message: 'Comment is not created' });
    }
    const comment = await this.commentRepository.create({
      content: createCommentDto.content,
      userId: user.id,
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
      attributes: [
        'id',
        'content',
        'createdAt',
        'updatedAt',
        'likesUsersIds',
        'dislikesUsersIds',
      ],
      include: [
        {
          attributes: ['id', 'firstName', 'lastName', 'fullName', 'photo'],
          association: 'user',
          model: User,
        },
      ],
    });
  }

  public async updateComment(
    id: number,
    updateCommentDto: UpdateCommentDto,
    token: string,
  ) {
    if (!updateCommentDto.content) {
      throw new BadRequestException({ message: 'Comment is not updated' });
    }

    const userByToken = await this.jwtService.verifyAsync(token);
    const user = await this.usersService.getUserById(userByToken.id);
    const comment = await this.getCommentById(id);
    if (!comment) {
      throw new NotFoundException({ message: 'Comment not found' });
    }
    if (comment.userId !== user.id) {
      throw new ForbiddenException({
        message: 'The user is not the author of the comment',
      });
    }
    comment.content = updateCommentDto.content;
    await comment.save();
    return this.getCommentById(comment.id, {
      attributes: [
        'id',
        'content',
        'createdAt',
        'updatedAt',
        'likesUsersIds',
        'dislikesUsersIds',
      ],
      include: [
        {
          attributes: ['id', 'firstName', 'lastName', 'fullName', 'photo'],
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
      const commentsIds = await this.getDescendantsIds(id);
      await this.removeCommentsArray(commentsIds);
      return;
    }
    throw new NotFoundException({ message: 'Comment not found' });
  }

  public async removeCommentsArray(ids: number[]) {
    await this.commentRepository.destroy({
      where: {
        id: ids,
      },
    });
  }

  public async getAllComments(articleId: number) {
    const comments = await this.commentRepository.findAll({
      attributes: [
        'id',
        'content',
        'createdAt',
        'updatedAt',
        'likesUsersIds',
        'dislikesUsersIds',
      ],
      include: [
        {
          model: User,
          association: 'user',
          attributes: ['id', 'firstName', 'lastName', 'fullName', 'photo'],
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

  public async addLikeDislike(
    updateLikeDislikeDto: UpdateLikeDislikeDto,
    token: string,
  ) {
    if (!updateLikeDislikeDto.commentId || !updateLikeDislikeDto.status) {
      throw new BadRequestException({ message: 'Comment is not (dis)liked' });
    }
    const userByToken = await this.jwtService.verifyAsync(token);
    const user = await this.usersService.getUserById(userByToken.id);
    const comment = await this.getCommentById(updateLikeDislikeDto.commentId);
    if (!comment) {
      throw new NotFoundException({ message: 'Comment not found' });
    }
    if (updateLikeDislikeDto.status === -1) {
      const index = comment.dislikesUsersIds.findIndex(
        (userId: number) => userId === user.id,
      );
      if (index >= 0) {
        comment.dislikesUsersIds = comment.dislikesUsersIds.filter(
          (id: number) => id !== user.id,
        );
      } else {
        comment.dislikesUsersIds = [...comment.dislikesUsersIds, user.id];
      }
    } else {
      const index = comment.likesUsersIds.findIndex(
        (userId: number) => userId === user.id,
      );
      if (index >= 0) {
        comment.likesUsersIds = comment.likesUsersIds.filter(
          (id: number) => id !== user.id,
        );
      } else {
        comment.likesUsersIds = [...comment.likesUsersIds, user.id];
      }
    }
    await comment.save();
    return this.getCommentById(comment.id, {
      attributes: [
        'id',
        'content',
        'createdAt',
        'updatedAt',
        'likesUsersIds',
        'dislikesUsersIds',
      ],
      include: [
        {
          attributes: ['id', 'firstName', 'lastName', 'fullName', 'photo'],
          association: 'user',
          model: User,
        },
      ],
    });
  }

  public async getDescendantsIds(ancestorId: number) {
    const commentsTree = await this.treeRepository.findAll({
      attributes: ['descendantId'],
      where: { ancestorId },
    });
    return commentsTree.map((tree: CommentsTree) => tree.descendantId);
  }
}
