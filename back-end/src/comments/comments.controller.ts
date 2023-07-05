import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
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
    const token = request.headers['authorization'].split(' ')[1];
    return this.commentsService.createComment(createCommentDto, { token });
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
  public remove(@Param('id') id: string) {
    return this.commentsService.removeComment(+id);
  }
}
