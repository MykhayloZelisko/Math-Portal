import { ApiProperty } from '@nestjs/swagger';

export class CurrentArticleStatusDto {
  @ApiProperty({ example: false, description: 'An article can be rated by the current user or not' })
  public readonly canBeRated: boolean;
}
