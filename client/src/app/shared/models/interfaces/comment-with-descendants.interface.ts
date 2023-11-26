import { UserInterface } from './user.interface';
import { DescendantInterface } from './descendant.interface';

export interface CommentWithDescendantsInterface {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likesUsersIds: string[];
  dislikesUsersIds: string[];
  user: UserInterface;
  descendantsList: DescendantInterface[];
}
