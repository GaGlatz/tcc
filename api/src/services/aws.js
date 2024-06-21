import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "",
  credentials: {
    accessKeyId: "",
    secretAccessKey: "",
  },
});

export async function uploadToS3(file, filename, acl = "public-read") {
  const uploadParams = {
    Bucket: "",
    Key: filename,
    Body: file.data,
    ACL: acl,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    return { error: false, message: data };
  } catch (err) {
    return { error: true, message: err };
  }
}

export async function deleteFileS3(key) {
  const deleteParams = {
    Bucket: "",
    Key: key,
  };

  try {
    const data = await s3Client.send(new DeleteObjectCommand(deleteParams));
    return { error: false, message: data };
  } catch (err) {
    return { error: true, message: err };
  }
}
