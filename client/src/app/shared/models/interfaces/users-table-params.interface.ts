import { SortingType } from '../types/sorting.type';

export interface UsersTableParamsInterface {
  filter: string;
  sortByName: SortingType;
  sortByRole: SortingType;
  page: number;
  size: number;
}
