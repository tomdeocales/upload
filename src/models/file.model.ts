import { pool } from '../config/db.config';
import { FileResponse } from '../types/file.types';

export class FileModel {
  // Save file information to database
  static async create(
    originalName: string,
    fileType: string,
    fileUrl: string,
    publicId: string
  ): Promise<FileResponse> {
    try {
      const result = await pool.query(
        `INSERT INTO files (original_name, file_type, file_url, public_id) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, original_name as "originalName", file_type as "fileType", file_url as "fileUrl", created_at as "createdAt"`,
        [originalName, fileType, fileUrl, publicId]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error saving file to database:', error);
      throw error;
    }
  }

  // Get file by id
  static async getById(id: string): Promise<FileResponse | null> {
    try {
      const result = await pool.query(
        `SELECT id, original_name as "originalName", file_type as "fileType", file_url as "fileUrl", created_at as "createdAt"
         FROM files WHERE id = $1`,
        [id]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error retrieving file from database:', error);
      throw error;
    }
  }
}