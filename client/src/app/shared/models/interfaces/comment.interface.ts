import { UserInterface } from './user.interface';

export interface CommentInterface {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: UserInterface;
  nearestAncestorId: number;
  level: number;
}
