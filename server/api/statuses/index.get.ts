import { StatusModel } from "~/server/models/Status";

export default defineEventHandler(async (event) => {
  const statuses = await StatusModel.findAll();
  return statuses;
});
