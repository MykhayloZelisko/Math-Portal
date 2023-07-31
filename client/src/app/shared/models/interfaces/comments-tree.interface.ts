import { UserInterface } from './user.interface';

export interface CommentsTreeInterface {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  level: number;
  nearestAncestorId: number;
  likesUsersIds: number[];
  dislikesUsersIds: number[];
  user: UserInterface;
  children: CommentsTreeInterface[];
}
