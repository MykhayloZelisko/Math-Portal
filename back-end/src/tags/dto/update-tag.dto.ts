import { PickType } from '@nestjs/swagger';
import { CreateTagDto } from './create-tag.dto';

export class UpdateTagDto extends PickType(CreateTagDto, ['value']) {}
