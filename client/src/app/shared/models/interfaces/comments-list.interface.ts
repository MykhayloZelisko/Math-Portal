import { CommentWithLevelInterface } from './comment-with-level.interface';

export interface CommentsListInterface {
  total: number;
  comments: CommentWithLevelInterface[];
}
