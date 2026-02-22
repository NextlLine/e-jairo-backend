import { DocumentRepository } from '../../domain/document/document.repository';
import { s3 } from './client';

export class DocumentS3Repository implements DocumentRepository {
  async upload(key: string, buffer: Buffer, contentType: string) {
    await s3.putObject({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }).promise();
  }

  async delete(key: string) {
    await s3.deleteObject({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
    }).promise();
  }
}

export const documentS3Repository = new DocumentS3Repository();