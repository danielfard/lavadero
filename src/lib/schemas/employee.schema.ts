import { z } from 'zod/v4';

export const createEmployeeSchema = z.object({
	name: z.string().min(1, 'El nombre es obligatorio'),
	phone: z.string().min(1, 'El teléfono es obligatorio'),
	commission: z.number().min(0).max(100).default(30),
	state: z.boolean().default(true)
});

export const updateEmployeeSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, 'El nombre es obligatorio'),
	phone: z.string().min(1, 'El teléfono es obligatorio'),
	commission: z.number().min(0).max(100),
	state: z.boolean()
});
