import { Queue } from "bullmq";
import { getRedisConnectionObject } from "../config/redis.config";

export const MAILER_QUEUE = "queue-mailer";

export const mailerQueue = new Queue(MAILER_QUEUE, {
  connection: getRedisConnectionObject(),
});
