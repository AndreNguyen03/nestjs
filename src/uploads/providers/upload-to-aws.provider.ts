import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import * as path from 'path'
import { v4 as uuid4 } from 'uuid'

@Injectable()
export class UploadToAwsProvider {
    constructor(
        private readonly configService: ConfigService
    ) { }

    public async fileUpload(file: Express.Multer.File) {
        const accessKeyId = this.configService.get<string>('appConfig.awsAccessKeyId');
        const secretAccessKey = this.configService.get<string>('appConfig.awsSecretAccessKey');
        const region = this.configService.get<string>('appConfig.awsRegion');
        const bucket = this.configService.get<string>('appConfig.awsBucketName');

        if (!accessKeyId || !secretAccessKey || !region || !bucket) {
            throw new Error('Missing AWS config');
        }

        const s3 = new S3({
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            region,
        });

        try {
            const uploadResult = await s3.upload({
                Bucket: bucket,
                Body: file.buffer,
                Key: this.generateFileName(file),
                ContentType: file.mimetype,
            }).promise();

            return uploadResult.Key;
        } catch (error) {
            throw new RequestTimeoutException(error);
        }
    }

    private generateFileName(file: Express.Multer.File): string {
        //extract file name
        let name = file.originalname.split('.')[0];
        //remove white spaces
        name.replace(/\s/g, '').trim();
        //extract extension
        let extension = path.extname(file.originalname);
        //generate timestamp
        let timestamp = new Date().getTime().toString().trim();
        //return file uuid
        return `${name}-${timestamp}-${uuid4()}${extension}`
    }
} 
