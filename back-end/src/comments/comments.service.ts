import {
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
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    @Inject(forwardRef(() => ArticlesService))
    private articlesService: ArticlesService,
    private jwtService: JwtService,
  ) {}

  public async createComment(
    createCommentDto: CreateCommentDto,
    token: string,
  ): Promise<Comment> {
    const userByToken = await this.jwtService.verifyAsync(token);
    const user = await this.usersService.getUserById(userByToken.id);
    await this.articlesService.getArticleById(createCommentDto.articleId);
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
    id: string,
    updateCommentDto: UpdateCommentDto,
    token: string,
  ): Promise<Comment> {
    const userByToken = await this.jwtService.verifyAsync(token);
    const user = await this.usersService.getUserById(userByToken.id);
    const comment = await this.getCommentById(id);
    if (comment.userId !== user.id) {
      throw new ForbiddenException('The user is not the author of the comment');
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
    id: string,
    options?: Omit<FindOptions<Comment>, 'where'>,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findByPk(id, options);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  public async removeComment(id: string): Promise<void> {
    const comment = await this.getCommentById(id);
    const commentsIds = await this.getDescendantsIds(comment.id);
    await this.removeCommentsArray(commentsIds);
  }

  public async removeCommentsArray(ids: string[]): Promise<void> {
    await this.commentRepository.destroy({
      where: {
        id: ids,
      },
    });
  }

  public async getAllCommentsByArticleId(
    articleId: string,
  ): Promise<Comment[]> {
    return this.commentRepository.findAll({
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
  }

  public async addLikeDislike(
    updateLikeDislikeDto: UpdateLikeDislikeDto,
    token: string,
  ): Promise<Comment> {
    const userByToken = await this.jwtService.verifyAsync(token);
    const user = await this.usersService.getUserById(userByToken.id);
    const comment = await this.getCommentById(updateLikeDislikeDto.commentId);
    if (updateLikeDislikeDto.status === -1) {
      const index = comment.dislikesUsersIds.findIndex(
        (userId: string) => userId === user.id,
      );
      if (index >= 0) {
        comment.dislikesUsersIds = comment.dislikesUsersIds.filter(
          (id: string) => id !== user.id,
        );
      } else {
        comment.dislikesUsersIds = [...comment.dislikesUsersIds, user.id];
      }
    } else {
      const index = comment.likesUsersIds.findIndex(
        (userId: string) => userId === user.id,
      );
      if (index >= 0) {
        comment.likesUsersIds = comment.likesUsersIds.filter(
          (id: string) => id !== user.id,
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

  public async getDescendantsIds(ancestorId: string): Promise<string[]> {
    const commentsTree = await this.treeRepository.findAll({
      attributes: ['descendantId'],
      where: { ancestorId },
    });
    return commentsTree.map((tree: CommentsTree) => tree.descendantId);
  }

  public async getAllCommentsByUserId(userId: string): Promise<Comment[]> {
    return this.commentRepository.findAll({
      attributes: ['id'],
      where: { userId },
    });
  }
}
