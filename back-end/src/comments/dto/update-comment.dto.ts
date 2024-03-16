import { CreateCommentDto } from './create-comment.dto';
import { PickType } from '@nestjs/swagger';

export class UpdateCommentDto extends PickType(CreateCommentDto, ['content']) {}
