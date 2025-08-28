import { Job, Worker } from "bullmq";
import { NotificationDto } from "../dtos/notification.dto";
import { MAILER_QUEUE } from "../queues/mailer.queue";
import { getRedisConnectionObject } from "../config/redis.config";
import { MAILER_PAYLOAD } from "../producers/email.producer";
import { renderMailTemplate } from "../templates/templates.handler";
import { sendEmail } from "../services/mailer.service";
import logger from "../config/logger.config";

export const setupMailerWorker = () => {
  const emailProcessor = new Worker<NotificationDto>(
    MAILER_QUEUE,
    async (job: Job) => {
      if (job.name !== MAILER_PAYLOAD) {
        throw new Error("Invalid job name");
      }
      // call the service layer from here to send email
      const payload = job.data;
      console.log(`Processing email job: ${JSON.stringify(payload)}`);

      const emailContent = await renderMailTemplate(
        payload.templateId,
        payload.params
      );

      await sendEmail(payload.to, payload.subject, emailContent);

      logger.info(`Email job ${job.id} completed successfully`);
    },
    {
      connection: getRedisConnectionObject(),
    }
  );

  emailProcessor.on("failed", () => {
    console.log("Email processing failed");
  });
  emailProcessor.on("completed", () => {
    console.log("Email processed successfully");
  });
};
