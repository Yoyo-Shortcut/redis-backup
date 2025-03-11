import { backup } from "@/backup";
import { resolvedEnv } from "@/env";
import { CronJob } from "cron";

const main = async () => {
  console.log("NodeJS Version: " + process.version);

  if (resolvedEnv.RUN_ON_STARTUP || resolvedEnv.SINGLE_SHOT_MODE) {
    console.log("Running on start backup...");

    await tryBackup();

    if (resolvedEnv.SINGLE_SHOT_MODE) {
      console.log("Database backup complete, exiting...");
      process.exit(0);
    }
  }

  const job = new CronJob(resolvedEnv.BACKUP_CRON_SCHEDULE, async () => {
    await tryBackup();
  });

  job.start();

  console.log("Backup cron scheduled...");
};

const tryBackup = async () => {
  try {
    await backup();
  } catch (error) {
    console.error("Error while running backup: ", error);
    process.exit(1);
  }
};

// === Main

main();
