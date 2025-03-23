import { Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Auth } from "src/common/decorators/auth.decorator";
import { UploadService } from "./upload.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { imageFileFilter } from "src/common/utils/upload.utils";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { UPLOAD_IMAGE_MAX_SIZE } from "src/common/constants/upload.constant";
import { UploadImageDto } from "./dto/upload.dto";
import { UserRole } from "src/common/enums/user.enum";

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) { }

  @Get('images')
  allImages() {
    return this.uploadService.allImages()
  }

  @Post('image')
  @Auth(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: imageFileFilter,
      limits: {
        fileSize: UPLOAD_IMAGE_MAX_SIZE,
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImageDto })
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadImage(file);
  }

  @Delete('image/:id')
  @Auth(UserRole.ADMIN)
  deleteImage(@Param('id') id: string) {
    return this.uploadService.deleteImage(id);
  }
}