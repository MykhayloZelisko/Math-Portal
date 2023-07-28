import { UserInterface } from './user.interface';
import { DescendantInterface } from './descendant.interface';

export interface CommentWithDescendantsInterface {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: UserInterface;
  descendantsList: DescendantInterface[];
}
