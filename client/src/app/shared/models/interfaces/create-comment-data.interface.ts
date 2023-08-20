export interface CreateCommentDataInterface {
  content: string;
  articleId: string;
  parentCommentId: string | null;
  level: number;
}
