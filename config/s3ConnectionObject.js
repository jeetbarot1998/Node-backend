const AWS = require('aws-sdk')

const s3 = new AWS.S3({
    "region": "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // Bucket : process.env.AWS_BUCKET_NAME
})

module.exports = s3;