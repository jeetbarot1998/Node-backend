const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const S3fileController = require('../controllers/fileUploadController');

router.post('/download', S3fileController.handleDownload);
router.post('/upload', fileUpload({ createParentPath : true}) , S3fileController.handleUpload);
router.get('/listFiles',S3fileController.listFiles)

module.exports = router;