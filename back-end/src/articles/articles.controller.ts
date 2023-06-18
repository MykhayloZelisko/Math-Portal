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
  public removeArticle(@Param('id') id: string) {
    return this.articlesService.removeArticle(+id);
  }

  @ApiOperation({ summary: 'Get article' })
  @ApiResponse({ status: 200, type: Article })
  @Get(':id')
  public getArticle(@Param('id') id: string) {
    return this.articlesService.getArticle(+id);
  }

  @ApiOperation({ summary: 'Get list of articles' })
  @ApiResponse({ status: 200, type: [Article] })
  @Get()
  public getAllArticles() {
    return this.articlesService.getAllArticles();
  }
}
