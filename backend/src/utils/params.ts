import { Request } from "express";

/** Express 5 types params as string | string[]; we always use single-segment params. */
export function param(req: Request, name: string): string {
  const value = req.params[name];
  return Array.isArray(value) ? value[0] : value;
}
