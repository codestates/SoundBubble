import aws from "aws-sdk";
import { logError } from "../utils/log";

//* aws config
aws.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

export const s3: aws.S3 = new aws.S3();

export const deleteResource = async (bucket: string, filename: string): Promise<void> => {
	s3.deleteObject(
		{
			Bucket: bucket,
			Key: filename,
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		function (error: aws.AWSError, data: aws.S3.DeleteObjectOutput) {
			if (error) {
				logError("S3 리소스 삭제 실패");
				console.error(error);
			}
		},
	);
};
