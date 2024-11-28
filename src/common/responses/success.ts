import SuccessResponse from "@/types/success-response";
import type { Response } from "express";

export const success = ({
  res,
  status = 200,
  info,
  data,
}: SuccessResponse): Response => {
  if (info) {
    return res.status(status).json({ info, results: data });
  }
  return res.status(status).json({ results: data });
};
