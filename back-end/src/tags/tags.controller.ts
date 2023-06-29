import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
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

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  public constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({ summary: 'Create tag' })
  @ApiResponse({ status: 201, type: Tag })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Post()
  public createTag(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.createTag(createTagDto);
  }

  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: 200, type: [Tag] })
  @Get()
  public getAllTags() {
    return this.tagsService.getAllTags();
  }

  @ApiOperation({ summary: 'Delete tag' })
  @ApiResponse({ status: 200 })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Delete(':id')
  public removeTag(@Param('id') id: string) {
    return this.tagsService.removeTag(+id);
  }

  @ApiOperation({ summary: 'Update tag' })
  @ApiResponse({ status: 200, type: Tag })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Put(':id')
  public updateTag(
    @Param('id') id: number,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagsService.updateTag(id, updateTagDto);
  }
}