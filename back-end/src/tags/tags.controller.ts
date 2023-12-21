import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Tag } from './models/tag.model';
import { CreateTagDto } from './dto/create-tag.dto';
import { AdminGuard } from '../auth/guards/admin/admin.guard';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ValidationPipe } from '../pipes/validation/validation.pipe';
import { ParseUUIDv4Pipe } from '../pipes/parse-uuidv4/parse-UUIDv4.pipe';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  public constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({ summary: 'Create tag' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Tag })
  @UseGuards(AdminGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Post()
  public async createTag(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagsService.createTag(createTagDto);
  }

  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: HttpStatus.OK, type: [Tag] })
  @Get()
  public async getAllTags(): Promise<Tag[]> {
    return this.tagsService.getAllTags({ order: [['value', 'ASC']] });
  }

  @ApiOperation({ summary: 'Delete tag' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Delete(':id')
  public async removeTag(
    @Param('id', ParseUUIDv4Pipe) id: string,
  ): Promise<void> {
    return this.tagsService.removeTag(id);
  }

  @ApiOperation({ summary: 'Update tag' })
  @ApiResponse({ status: HttpStatus.OK, type: Tag })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Put(':id')
  public async updateTag(
    @Param('id', ParseUUIDv4Pipe) id: string,
    @Body(ValidationPipe) updateTagDto: UpdateTagDto,
  ): Promise<Tag> {
    return this.tagsService.updateTag(id, updateTagDto);
  }
}
