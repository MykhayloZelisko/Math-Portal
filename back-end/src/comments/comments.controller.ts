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
  public async createComment(
    @Req() request: Request,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const token = request.headers['authorization'].split(' ')[1]; // eslint-disable-line
    return this.commentsService.createComment(createCommentDto, token);
  }

  @ApiOperation({ summary: 'Get list of comments for current article' })
  @ApiResponse({ status: HttpStatus.OK, type: [Comment] })
  @Get(':articleId')
  public async getAllComments(
    @Param('articleId', ParseUUIDv4Pipe) articleId: string,
  ): Promise<Comment[]> {
    return this.commentsService.getAllCommentsByArticleId(articleId);
  }

  @ApiOperation({ summary: 'Delete comment' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Delete(':id')
  public async removeComment(
    @Param('id', ParseUUIDv4Pipe) id: string,
  ): Promise<void> {
    return this.commentsService.removeComment(id);
  }

  @ApiOperation({ summary: 'Update current comment (dis)likes' })
  @ApiResponse({ status: HttpStatus.OK, type: Comment })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  @Put('/likes')
  public async updateLikesStatus(
    @Req() request: Request,
    @Body() updateLikeDislikeDto: UpdateLikeDislikeDto,
  ): Promise<Comment> {
    const token = request.headers['authorization'].split(' ')[1]; // eslint-disable-line
    return this.commentsService.addLikeDislike(updateLikeDislikeDto, token);
  }

  @ApiOperation({ summary: 'Update current comment' })
  @ApiResponse({ status: HttpStatus.OK, type: Comment })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  public async updateComment(
    @Req() request: Request,
    @Param('id', ParseUUIDv4Pipe) id: string,
    @Body(ValidationPipe) updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const token = request.headers['authorization'].split(' ')[1]; // eslint-disable-line
    return this.commentsService.updateComment(id, updateCommentDto, token);
  }
}
