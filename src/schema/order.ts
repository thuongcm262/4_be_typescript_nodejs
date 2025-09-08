import { OrderEventStatus } from "@prisma/client";
import z from "zod";

export const OrderStatusSchema = z.object({
    status: z.enum(OrderEventStatus)
})