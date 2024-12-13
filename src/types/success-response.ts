import type { Response } from "express";
import { InfoPagination } from "./info-pagination";

export interface SuccessResponse {
  res: Response;
  status?: number;
  data: any;
  info?: InfoPagination;
}
