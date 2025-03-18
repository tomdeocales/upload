import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import upload from '../middleware/multer.middleware';

const router = Router();

// Route for file upload
router.post('/upload', upload.single('file'), UploadController.uploadFile);

export default router;