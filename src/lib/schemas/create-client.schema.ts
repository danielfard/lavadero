import { z } from 'zod/v4';

export const createClientSchema = z.object({
	name: z.string().min(1),
	document: z.string().min(1),
	phone: z.string().min(1),
	birthdate: z.string().min(1),
	email: z.email().nullable().optional()
});

export const updateClientSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, 'El nombre es obligatorio'),
	document: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
	birthdate: z.string().nullable().optional(),
	email: z.email().nullable().optional()
});