import { TagInterface } from './tag.interface';

export interface ArticleInterface {
  id: number;
  title: string;
  content: string;
  rating: number;
  tags: TagInterface[];
}
