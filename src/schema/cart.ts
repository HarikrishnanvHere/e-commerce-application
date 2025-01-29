import { z } from "zod";

export const createCartSchema = z.object({
  productId: z.number(),
  quantity: z.number(),
});

export const changeQuantitySchema = z.object({
  quantity: z.number(),
});
