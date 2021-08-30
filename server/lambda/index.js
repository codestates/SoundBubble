"use strict";

const sharp = require("sharp");
const aws = require("aws-sdk");

aws.config.update({
	accessKeyId: process.env.S3_ACCESS_KEY_ID,
	secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
	region: process.env.S3_REGION,
});

const s3 = new aws.S3();
console.log(s3);

exports.handler = async (event, context, callback) => {
	//* s3 및 파일 설정
	const bucket = event.Records[0].s3.bucket.name;
	const key = event.Records[0].s3.object.key;
	const fullname = key.split("/").pop().split(".");
	const filename = fullname[0];
	const ext = fullname[1];
	const requiredFormat = ext === "jpg" ? "jpeg" : ext;
	console.log("name: ", filename, " ext: ", ext);

	try {
		// s3에서 이미지 get
		const s3Object = await s3.getObject({ Bucket: bucket, Key: key }).promise();

		// 이미지 리사이징
		const resizedImage = await sharp(s3Object.Body).withMetadata().resize(200, 200).toFormat(requiredFormat).toBuffer();

		// 리사이징 된 이미지 s3에 put
		await s3
			.putObject({
				Bucket: bucket,
				Key: `thumb/${filename}.${requiredFormat}`,
				Body: resizedImage,
				ContentType: "image",
			})
			.promise();

		console.log("original size: ", s3Object.Body.length, "resized size: ", resizedImage.length);
		return callback(null, `thumb/${filename}.${requiredFormat}`);
	} catch (error) {
		console.error(error);
		return callback(error);
	}
};

// (1) upload lambda code to aws

// (2) install modules
// caution: installing sharp
//$ npm install --arch=x64 --platform=linux --target=10.15.0 sharp

// (3) upload 'nodejs/node_modules' folder to lambda layer
