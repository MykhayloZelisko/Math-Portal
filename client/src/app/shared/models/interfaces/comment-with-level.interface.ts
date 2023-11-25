import { UserInterface } from './user.interface';

export interface CommentWithLevelInterface {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  level: number;
  likesUsersIds: string[];
  dislikesUsersIds: string[];
  user: UserInterface;
}
