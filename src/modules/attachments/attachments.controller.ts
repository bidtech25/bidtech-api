import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { AttachmentsService } from './attachments.service';

@ApiTags('Process Attachments')
@ApiBearerAuth()
@Controller('processes/:processId/attachments')
@UseGuards(JwtAuthGuard)
export class AttachmentsController {
  constructor(private readonly service: AttachmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Upload attachment to process' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('processId') processId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ 
            fileType: /(pdf|doc|docx|xls|xlsx|png|jpg|jpeg)$/ 
          }),
        ],
      }),
    )
    file: any,
    @CurrentUser('id') userId: string,
  ) {
    return this.service.upload(processId, file, userId);
  }

  @Get()
  @ApiOperation({ summary: 'List all attachments for a process' })
  async list(@Param('processId') processId: string) {
    return this.service.list(processId);
  }

  @Delete(':attachmentId')
  @ApiOperation({ summary: 'Delete an attachment' })
  async delete(@Param('attachmentId') attachmentId: string) {
    return this.service.delete(attachmentId);
  }
}
