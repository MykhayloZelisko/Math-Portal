import { UserInterface } from './user.interface';
import { TagInterface } from './tag.interface';
import { ArticleInterface } from './article.interface';

export interface DialogContentInterface {
  title?: string;
  text?: string;
  user?: UserInterface;
  tag?: TagInterface;
  article?: ArticleInterface;
}
