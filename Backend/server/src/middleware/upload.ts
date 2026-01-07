import multer from 'multer';
import path from 'path';

// Define where to store images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/avatars'); // Ensure this folder exists!
  },
  filename: (req, file, cb) => {
    // Unique filename: userId + timestamp + extension
    const userId = (req as any).user.id;
    cb(null, `avatar-${userId}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Filter to only allow images
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

export const upload = multer({ storage, fileFilter });