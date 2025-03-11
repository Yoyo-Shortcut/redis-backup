import { unlink } from "fs";

export const deleteFile = async (filePath: string) => {
  console.log(`Deleting file ${filePath}...`);

  await new Promise((resolve, reject) => {
    unlink(filePath, (err) => {
      reject({ error: err });
      return;
    });
    resolve(undefined);
  });
};
