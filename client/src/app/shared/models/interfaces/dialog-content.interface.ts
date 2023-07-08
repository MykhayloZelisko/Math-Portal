import { UserInterface } from './user.interface';
import { TagInterface } from './tag.interface';

export interface DialogContentInterface {
  title?: string;
  text?: string;
  user?: UserInterface;
  tag?: TagInterface;
}
