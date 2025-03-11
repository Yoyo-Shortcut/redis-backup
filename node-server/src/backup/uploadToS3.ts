import { resolvedEnv } from "@/env";
import {
  PutObjectCommandInput,
  S3Client,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import { createReadStream } from "fs";
import crypto from "crypto";
import fs from "fs";
import { Upload } from "@aws-sdk/lib-storage";

export const uploadToS3 = async (input: { name: string; path: string }) => {
  console.log("Uploading backup to S3...");

  let { name, path } = input;

  const bucket = resolvedEnv.AWS_S3_BUCKET;

  const clientOptions: S3ClientConfig = {
    region: resolvedEnv.AWS_S3_REGION,
    forcePathStyle: resolvedEnv.AWS_S3_FORCE_PATH_STYLE,
  };

  if (resolvedEnv.AWS_S3_ENDPOINT) {
    console.log(`Using custom endpoint: ${resolvedEnv.AWS_S3_ENDPOINT}`);

    clientOptions.endpoint = resolvedEnv.AWS_S3_ENDPOINT;
  }

  if (resolvedEnv.AWS_S3_BUCKET_SUBFOLDER) {
    name = resolvedEnv.AWS_S3_BUCKET_SUBFOLDER + "/" + name;
  }

  let params: PutObjectCommandInput = {
    Bucket: bucket,
    Key: name,
    Body: createReadStream(path),
  };

  if (resolvedEnv.AWS_S3_SUPPORT_OBJECT_LOCK) {
    console.log("MD5 hashing file...");

    const md5Hash = await createMD5(path);

    console.log("Done hashing file");

    params.ContentMD5 = Buffer.from(md5Hash, "hex").toString("base64");
  }

  const client = new S3Client(clientOptions);

  await new Upload({
    client,
    params: params,
  }).done();

  console.log("Backup uploaded to S3...");
};

export const createMD5 = (path: string) => {
  return new Promise<string>((resolve, reject) => {
    const hash = crypto.createHash("md5");
    const rs = fs.createReadStream(path);
    rs.on("error", reject);
    rs.on("data", (chunk) => hash.update(chunk));
    rs.on("end", () => resolve(hash.digest("hex")));
  });
};
