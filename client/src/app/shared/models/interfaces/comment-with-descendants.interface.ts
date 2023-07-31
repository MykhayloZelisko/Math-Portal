import { UserInterface } from './user.interface';
import { DescendantInterface } from './descendant.interface';

export interface CommentWithDescendantsInterface {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  likesUsersIds: number[];
  dislikesUsersIds: number[];
  user: UserInterface;
  descendantsList: DescendantInterface[];
}
