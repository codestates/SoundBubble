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
  const bucket = event.Records[0].s3.bucket.name;
  console.log("Bucket: ", bucket);
  const key = event.Records[0].s3.object.key;
  console.log("Key: ", key);
  const fullname = key.split("/").pop().split(".");
  const filename = fullname[0];
  const ext = fullname[1];
  const requiredFormat = ext === "jpg" ? "jpeg" : ext;
  console.log("name: ", filename, " ext: ", ext);

  try {
    const s3Object = await s3.getObject({ Bucket: bucket, Key: key }).promise();
    console.log("original: ", s3Object.Body.length);
    const resizedImage = await sharp(s3Object.Body).withMetadata().resize(200, 200).toFormat(requiredFormat).toBuffer();

    await s3
      .putObject({
        Bucket: bucket,
        Key: `thumb/${filename}.${requiredFormat}`,
        Body: resizedImage,
        ContentType: "image",
      })
      .promise();

    console.log("resize: ", resizedImage.length);
    return callback(null, `thumb/${filename}.${requiredFormat}`);
  } catch (error) {
    console.error(error);
    return callback(error);
  }
};

// install sharp
//$ npm install --arch=x64 --platform=linux --target=10.15.0 sharp

// upload 'nodejs/node_modules' folder to lambday layer
