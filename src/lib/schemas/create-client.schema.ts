import { z } from 'zod/v4';

export const createClientSchema = z.object({
    name: z.string().min(1),
    document: z.string().min(1),
    phone: z.string().min(1),
    birthdate: z.string().min(1),
});