import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../aws/s3";

const extensions: string[] = ["wav", "jpg"];

const upload: multer.Multer = multer({
  storage: multerS3({
    s3: s3,
    bucket: "soundbubble-resource",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: function (req: Express.Request, file: Express.Multer.File, callback) {
      let extenstion: string = file.originalname.split(".").pop()?.toLowerCase() as string;
      if (!extensions.includes(extenstion)) extenstion = "wav";
      const fileName = Date.now() + "." + extenstion;
      let fullPath;
      if (extenstion === "wav") {
        fullPath = "sound/" + fileName;
      } else {
        fullPath = "original/" + fileName;
      }
      callback(null, fullPath);
    },
  }),
});

export default upload;
