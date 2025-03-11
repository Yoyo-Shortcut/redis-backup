import path from "path";
import { resolvedEnv } from "../env";
import { dumpToFile } from "./dumpToFile";
import { uploadToS3 } from "./uploadToS3";
import { deleteFile } from "./deleteFile";

export const backup = async () => {
  console.log("Initiating DB backup...");

  const date = new Date().toISOString(); // E.g. 2025-03-11T00:23:21.864Z
  const timestamp = date.replace(/[:.]+/g, "-"); // Replace consecutive colons and periods with a single hyphen

  const redisFileName = `${resolvedEnv.BACKUP_FILE_PREFIX}-${timestamp}.rdb`;
  const zipFileName = `${resolvedEnv.BACKUP_FILE_PREFIX}-${timestamp}.tar.gz`;

  const folderPath = path.join(__dirname, "..", "..", "..", "backups");
  const redisFilePath = path.join(folderPath, redisFileName);
  const zipFilePath = path.join(folderPath, zipFileName);

  await dumpToFile({ redisFilePath, zipFilePath });

  await uploadToS3({ name: zipFileName, path: zipFilePath });

  await deleteFile(redisFilePath);
  await deleteFile(zipFilePath);

  console.log("DB backup complete...");
};
