import { Request, Response } from 'express';
import { FileModel } from '../models/file.model';
import path from 'path';

export class UploadController {
  // Controller method for file upload
  static async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const file = req.file as Express.Multer.File & { 
        path: string;
        filename: string;
        public_id?: string;
      };

      // Extract file information
      const originalName = file.originalname;
      const fileExtension = path.extname(originalName).toLowerCase();
      const fileType = fileExtension === '.pdf' ? 'pdf' : 'docx';
      const fileUrl = file.path;
      const publicId = file.public_id || file.filename;

      // Save file information to database
      const savedFile = await FileModel.create(
        originalName,
        fileType,
        fileUrl,
        publicId
      );

      // Return success response
      res.status(201).json({
        message: 'File uploaded successfully',
        file: {
          id: savedFile.id,
          fileType: savedFile.fileType,
          fileUrl: savedFile.fileUrl
        }
      });
    } catch (error) {
      console.error('Error in file upload:', error);
      res.status(500).json({ 
        message: 'Error uploading file',
        error: (error as Error).message 
      });
    }
  }
}