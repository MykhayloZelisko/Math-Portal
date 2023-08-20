import { UserInterface } from './user.interface';

export interface CommentInterface {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likesUsersIds: string[];
  dislikesUsersIds: string[];
  user: UserInterface;
}
