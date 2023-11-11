import { SolvingTriangleEnum } from '../enums/solving-triangle.enum';

export interface TriangleTaskConfigInterface {
  type: SolvingTriangleEnum | null;
  labels: string[];
}
