import { UserInterface } from './user.interface';

export interface CommentsTreeInterface {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  level: number;
  nearestAncestorId: string | null;
  likesUsersIds: string[];
  dislikesUsersIds: string[];
  user: UserInterface;
  children: CommentsTreeInterface[];
}
