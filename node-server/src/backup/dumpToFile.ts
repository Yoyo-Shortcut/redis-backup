import { resolvedEnv } from "@/env";
import { exec, execSync } from "child_process";
import { filesize } from "filesize";
import { statSync } from "fs";
import path from "path";

export const dumpToFile = async (input: {
  redisFilePath: string;
  zipFilePath: string;
}) => {
  console.log("Dumping DB to file...");

  const { redisFilePath, zipFilePath } = input;
  const redisDirName = path.dirname(redisFilePath);
  const redisFileName = path.basename(redisFilePath);

  await new Promise((resolve, reject) => {
    const dumpCommands = [
      `redis-cli -u "${resolvedEnv.BACKUP_DATABASE_URL}" ${resolvedEnv.BACKUP_OPTIONS} --rdb ${redisFilePath}`,
      `tar -czvf ${zipFilePath} -C ${redisDirName} ${redisFileName}`,
    ].join(" && ");

    exec(dumpCommands, (error, stdout, stderr) => {
      if (error) {
        reject({ error: error, stderr: stderr.trimEnd() });
        return;
      }

      // check if archive is valid and contains data
      const isValidArchive =
        execSync(`gzip -cd ${zipFilePath} | head -c1`).length == 1
          ? true
          : false;

      if (isValidArchive == false) {
        reject({
          error:
            "Backup archive file is invalid or empty; check for errors above",
        });
        return;
      }

      // not all text in stderr will be a critical error, print the error / warning
      if (stderr != "") {
        console.log({ stderr: stderr.trimEnd() });
      }

      console.log("Backup archive file is valid");
      console.log("Backup filesize:", filesize(statSync(zipFilePath).size));

      // if stderr contains text, let the user know that it was potently just a warning message
      if (stderr != "") {
        console.log(
          `Potential warnings detected; Please ensure the backup file "${path.basename(zipFilePath)}" contains all needed data`
        );
      }

      resolve(undefined);
    });
  });

  console.log("DB dumped to file...");
};
