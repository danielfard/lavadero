import { z } from 'zod/v4';

export const addVehicleSchema = z.object({
	customer_id: z.string().uuid(),
	plate: z.string().min(1, 'La placa es obligatoria').max(10)
});

export const updateVehicleSchema = z.object({
	id: z.string().uuid(),
	plate: z.string().min(1, 'La placa es obligatoria').max(10)
});

export const removeVehicleSchema = z.object({
	id: z.string().uuid()
});
