export interface CreateCommentDataInterface {
  content: string;
  articleId: number;
  parentCommentId: number;
  level: number;
}
