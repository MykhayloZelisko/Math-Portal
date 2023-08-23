import {
  Body,
  Controller,
  Delete,
  Get, HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
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
import { ValidationPipe } from '../pipes/validation/validation.pipe';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  public constructor(private readonly articlesService: ArticlesService) {}

  @ApiOperation({ summary: 'Create article' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Article })
  @UseGuards(AdminGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Post()
  public createArticle(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.createArticle(createArticleDto);
  }

  @ApiOperation({ summary: 'Update article' })
  @ApiResponse({ status: HttpStatus.OK, type: Article })
  @UseGuards(AdminGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Put(':id')
  public updateArticle(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.updateArticle(id, updateArticleDto);
  }

  @ApiOperation({ summary: 'Delete article' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Delete(':id')
  public removeArticle(@Param('id') id: string) {
    return this.articlesService.removeArticle(id);
  }

  @ApiOperation({ summary: 'Get article' })
  @ApiResponse({ status: HttpStatus.OK, type: Article })
  @Get(':id')
  public getArticleById(@Param('id') id: string) {
    return this.articlesService.getArticleById(id);
  }

  @ApiOperation({ summary: 'Get list of articles' })
  @ApiResponse({ status: HttpStatus.OK, type: ArticlesListDto })
  @Get()
  public getAllArticles(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('filter') filter: string,
    @Query('tagsIds') tagsIdsQuery: string,
  ) {
    const tagsIds = tagsIdsQuery ? tagsIdsQuery.split(',').map(String) : [];
    return this.articlesService.getAllArticlesWithParams(
      page,
      size,
      filter,
      tagsIds,
    );
  }
}
