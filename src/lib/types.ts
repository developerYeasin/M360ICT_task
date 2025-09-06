import { z } from 'zod';
import { masterFormSchema } from './schema';

export type FormValues = z.infer<typeof masterFormSchema>;