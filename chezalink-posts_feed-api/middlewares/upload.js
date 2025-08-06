const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../utils/cloudinary');

// For video uploads
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'chezalink/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi'],
  },
});

// For image uploads
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'chezalink/images',
    resource_type: 'image',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
  },
});

const uploadVideo = multer({ storage: videoStorage });
const uploadImage = multer({ storage: imageStorage });

module.exports = { uploadVideo, uploadImage };
