import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
  UsePipes,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { Comment } from './models/comment.model';
import { AdminGuard } from '../auth/guards/admin/admin.guard';
import { UpdateLikeDislikeDto } from './dto/update-like-dislike.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ValidationPipe } from '../pipes/validation/validation.pipe';
import { ParseUUIDv4Pipe } from '../pipes/parse-uuidv4/parse-UUIDv4.pipe';
import { ParseIntegerPipe } from '../pipes/parse-integer/parse-integer.pipe';
import { CommentsListDto } from './dto/comments-list.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  public constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Create comment for current article' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Comment })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Post()
  public createComment(
    @Req() request: Request,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const token = request.headers['authorization'].split(' ')[1]; // eslint-disable-line
    return this.commentsService.createComment(createCommentDto, token);
  }

  @ApiOperation({ summary: 'Get list of comments for current article' })
  @ApiResponse({ status: HttpStatus.OK, type: CommentsListDto })
  @Get('/:articleId')
  public getCommentsWithParamsByArticleId(
    @Param('articleId', ParseUUIDv4Pipe) articleId: string,
    @Query('page', ParseIntegerPipe) page: number,
    @Query('size', ParseIntegerPipe) size: number,
  ) {
    return this.commentsService.getCommentsWithParamsByArticleId(
      articleId,
      page,
      size,
    );
  }

  @ApiOperation({ summary: 'Get list of children comments for parent one' })
  @ApiResponse({ status: HttpStatus.OK, type: CommentsListDto })
  @Get('/children/:commentId')
  public getCommentsWithParamsByParentCommentId(
    @Param('commentId', ParseUUIDv4Pipe) commentId: string,
    @Query('page', ParseIntegerPipe) page: number,
    @Query('size', ParseIntegerPipe) size: number,
  ) {
    return this.commentsService.getCommentsWithParamsByParentCommentId(
      commentId,
      page,
      size,
    );
  }

  @ApiOperation({ summary: 'Delete comment' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Delete(':id')
  public remove(@Param('id', ParseUUIDv4Pipe) id: string) {
    return this.commentsService.removeComment(id);
  }

  @ApiOperation({ summary: 'Update current comment (dis)likes' })
  @ApiResponse({ status: HttpStatus.OK, type: Comment })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Put('/likes')
  public updateLikesStatus(
    @Req() request: Request,
    @Body() updateLikeDislikeDto: UpdateLikeDislikeDto,
  ) {
    const token = request.headers['authorization'].split(' ')[1]; // eslint-disable-line
    return this.commentsService.addLikeDislike(updateLikeDislikeDto, token);
  }

  @ApiOperation({ summary: 'Update current comment' })
  @ApiResponse({ status: HttpStatus.OK, type: Comment })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  public updateComment(
    @Req() request: Request,
    @Param('id', ParseUUIDv4Pipe) id: string,
    @Body(ValidationPipe) updateCommentDto: UpdateCommentDto,
  ) {
    const token = request.headers['authorization'].split(' ')[1]; // eslint-disable-line
    return this.commentsService.updateComment(id, updateCommentDto, token);
  }
}
