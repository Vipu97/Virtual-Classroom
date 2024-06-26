const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const bucket = process.env.BUCKET_NAME;
const fs = require('fs');

const uploadToS3 = async (path,originalFileName,mimetype) => {
    const client = new S3Client({
        region:'ap-south-1',
        credentials:{
            accessKeyId:process.env.S3_ACCESS_KEY,
            secretAccessKey:process.env.S3_SECRET_ACCESS_KEY
        },
    })
    const parts = originalFileName.split('.');
    const ext = parts[parts.length - 1];
    const newFileName = Date.now() + '.' + ext;
    try{
        await client.send(new PutObjectCommand({
            Bucket:bucket,
            Body:fs.readFileSync(path),
            Key:newFileName,
            ContentType:mimetype,
            ACL:'public-read'
        }))
        return `https://${bucket}.s3.amazonaws.com/${newFileName}`;
    }catch(err){
        throw err;
    }
}

module.exports = uploadToS3;