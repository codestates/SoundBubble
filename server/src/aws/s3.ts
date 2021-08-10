import aws from 'aws-sdk';

//* S3 이미지 서버 연결
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const s3: aws.S3 = new aws.S3();

export const deleteResource = async (bucket: string, filename: string) => {
  s3.deleteObject(
    {
      Bucket: bucket,
      Key: filename,
    },
    function (error: aws.AWSError, data: aws.S3.DeleteObjectOutput) {
      if (error) {
        console.error(error);
      }
    }
  );
};

console.log("resource server connected");