import { TagInterface } from './tag.interface';

export interface ArticleInterface {
  id: string;
  title: string;
  content: string;
  rating: number;
  votes: number;
  tags: TagInterface[];
}
