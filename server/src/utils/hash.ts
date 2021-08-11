import crypto from "crypto";

const hash = (value: any): string => {
  const hashed = crypto
    .createHash("sha512")
    .update(value + process.env.SALT_SECRET)
    .digest("hex");
  return hashed;
};

export default hash;