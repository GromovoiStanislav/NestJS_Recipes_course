import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "node:path";


@Controller()
export class AppController {

  @Get()
  getHello(): string {
    return "Hello World!";
  }

  @Post("/file")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        }
      })
    })
  )
  handleUpload(@UploadedFile() file: Express.Multer.File) {
    //console.log("file", file);
    return { ...file, path:file.destination+'/'+file.filename };
  }
}