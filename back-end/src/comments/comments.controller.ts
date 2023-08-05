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

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  public constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Create comment for current article' })
  @ApiResponse({ status: 201, type: Comment })
  @UseGuards(JwtAuthGuard)
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
  @ApiResponse({ status: 200, type: [Comment] })
  @Get(':articleId')
  public getAllComments(@Param('articleId') articleId: number) {
    return this.commentsService.getAllComments(articleId);
  }

  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({ status: 200 })
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Delete(':id')
  public remove(@Param('id') id: number) {
    return this.commentsService.removeComment(id);
  }

  @ApiOperation({ summary: 'Update current comment (dis)likes' })
  @ApiResponse({ status: 200, type: Comment })
  @UseGuards(JwtAuthGuard)
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
  @ApiResponse({ status: 200, type: Comment })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  public updateComment(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const token = request.headers['authorization'].split(' ')[1]; // eslint-disable-line
    return this.commentsService.updateComment(id, updateCommentDto, token);
  }
}
