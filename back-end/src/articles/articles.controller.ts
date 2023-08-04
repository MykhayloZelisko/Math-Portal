import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/admin/admin.guard';
import { Article } from './models/article.model';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticlesService } from './articles.service';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticlesListDto } from './dto/articles-list.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  public constructor(private readonly articlesService: ArticlesService) {}

  @ApiOperation({ summary: 'Create article' })
  @ApiResponse({ status: 201, type: Article })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Post()
  public createArticle(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.createArticle(createArticleDto);
  }

  @ApiOperation({ summary: 'Update article' })
  @ApiResponse({ status: 200, type: Article })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Put(':id')
  public updateArticle(
    @Param('id') id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.updateArticle(id, updateArticleDto);
  }

  @ApiOperation({ summary: 'Delete article' })
  @ApiResponse({ status: 200 })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Delete(':id')
  public removeArticle(@Param('id') id: number) {
    return this.articlesService.removeArticle(id);
  }

  @ApiOperation({ summary: 'Get article' })
  @ApiResponse({ status: 200, type: Article })
  @Get(':id')
  public getArticleById(@Param('id') id: number) {
    return this.articlesService.getArticleById(id);
  }

  @ApiOperation({ summary: 'Get list of articles' })
  @ApiResponse({ status: 200, type: ArticlesListDto })
  @Get()
  public getAllArticles(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('filter') filter: string,
    @Query('tagsIds') tagsIdsQuery: string,
  ) {
    const tagsIds = tagsIdsQuery ? tagsIdsQuery.split(',').map(Number) : [];
    return this.articlesService.getAllArticlesWithParams(
      page,
      size,
      filter,
      tagsIds,
    );
  }
}
