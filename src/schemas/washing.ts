import { z } from 'zod/v4';

export const washingSchema = z.object({
    employee: z.uuid(),
    vehicle: z.uuid(),
    serviceDate: z.date(),
    finalPrice: z.number().positive()
});