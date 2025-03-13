import path from "path";
import fs from "fs";
import dotenv from "dotenv";

const stringWithDefault = (value: string | undefined, defaultValue: string) => {
  if (value === undefined || value.length === 0) {
    return defaultValue;
  }
  return value;
};

const stringToBoolean = (value: string) => {
  return value.toLowerCase() === "true";
};

const NODE_ENV = stringWithDefault(process.env.NODE_ENV, "development");

if (NODE_ENV === "development") {
  try {
    const envPath = path.join(__dirname, "..", ".env");
    if (fs.existsSync(envPath)) {
      console.log("Importing env variables from .env");
      dotenv.config({ path: envPath });
    }
  } catch (err) {
    throw new Error("Missing .env file");
  }
}

export const resolvedEnv = {
  /**
   * Field: Required
   */
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,

  /**
   * Field: Required
   */
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

  /**
   * Field: Required
   */
  AWS_S3_REGION: process.env.AWS_S3_REGION,

  /**
   * Field: Required
   */
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,

  /**
   * A subfolder to place the backup files in
   *
   * Field: Optional
   *
   * Default: ""
   */
  AWS_S3_BUCKET_SUBFOLDER: stringWithDefault(
    process.env.AWS_S3_BUCKET_SUBFOLDER,
    ""
  ),

  /**
   * The S3 custom endpoint you want to use.
   *
   * Field: Optional
   *
   * Default: ""
   */
  AWS_S3_ENDPOINT: stringWithDefault(process.env.AWS_S3_ENDPOINT, ""),

  /**
   * Use path style for the endpoint instead of the default subdomain style, useful for MinIO and local S3 servers
   *
   * Field: Optional
   *
   * Default: "false"
   */
  AWS_S3_FORCE_PATH_STYLE: stringToBoolean(
    stringWithDefault(process.env.AWS_S3_FORCE_PATH_STYLE, "false")
  ),

  /**
   * Enables support for buckets with object lock by providing an MD5 hash with the backup file
   *
   * This is both time consuming and resource intensive so we leave it disabled by default
   *
   * Field: Optional
   *
   * Default: "false"
   */
  AWS_S3_SUPPORT_OBJECT_LOCK: stringToBoolean(
    stringWithDefault(process.env.AWS_S3_SUPPORT_OBJECT_LOCK, "false")
  ),

  /**
   * The connection string of the database to backup.
   *
   * Field: Required
   */
  BACKUP_DATABASE_URL: process.env.BACKUP_DATABASE_URL,

  /**
   * Any valid redis-cli options
   *
   * Field: Optional
   *
   * Default: ""
   */
  BACKUP_OPTIONS: stringWithDefault(process.env.BACKUP_OPTIONS, ""),

  /**
   * The cron schedule to run the backup on.
   *
   * Field: Optional
   *
   * Default: "0 5 * * *"
   */
  BACKUP_CRON_SCHEDULE: stringWithDefault(
    process.env.BACKUP_CRON_SCHEDULE,
    "0 5 * * *"
  ),

  /**
   * Prefix to the file name
   *
   * Field: Optional
   *
   * Default: "backup"
   */
  BACKUP_FILE_PREFIX: stringWithDefault(
    process.env.BACKUP_FILE_PREFIX,
    "backup"
  ),

  /**
   * Run a backup on startup of this application
   *
   * Field: Optional
   *
   * Default: "false"
   */
  RUN_ON_STARTUP: stringToBoolean(
    stringWithDefault(process.env.RUN_ON_STARTUP, "false")
  ),

  /**
   * Run a single backup on start and exit when completed
   *
   * Field: Optional
   *
   * Default: "false"
   */
  SINGLE_SHOT_MODE: stringToBoolean(
    stringWithDefault(process.env.SINGLE_SHOT_MODE, "false")
  ),
};
