import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Upload } from '../upload.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { ConfigService } from '@nestjs/config';
import { UploadFile } from '../interfaces/upload-file.interface';
import { fileTypes } from '../enums/file-types.enum';

@Injectable()
export class UploadsService {

    constructor(
        @InjectRepository(Upload)
        private readonly uploadsRepository: Repository<Upload>,
        private readonly uploadToAwsProvider: UploadToAwsProvider,
        private readonly configService: ConfigService
    ) { }

    public async uploadFile(file: Express.Multer.File) {
        // throw err for unsupported MIME types
        if (!['image/gif', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
            throw new BadRequestException('Mime type not supported')
        }

        try {
            // upload file to aws s3
            const name = await this.uploadToAwsProvider.fileUpload(file);
            // generate to a new entry in database
            const uploadFile: UploadFile = {
                name: name,
                path: `https://${this.configService.get('appConfig.awsCloudfrontUrl')}/${name}`,
                type: fileTypes.IMAGE,
                mime: file.mimetype,
                size: file.size,
            }

            const upload = this.uploadsRepository.create(uploadFile);
            return await this.uploadsRepository.save(upload)
        } catch (error) {
            throw new ConflictException(error)
        }
    }
}
