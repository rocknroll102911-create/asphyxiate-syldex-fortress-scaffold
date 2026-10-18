import { z } from 'zod';
import pino from 'pino';
const logger = pino();
export const BuilderSchema = z.object({ name: z.string(), industry: z.string() });
export class BuilderCore {
  generate(data: unknown) {
    const validated = BuilderSchema.parse(data);
    logger.info({ validated }, 'Generating scaffolding');
    return { files: [{ path: 'manifest.json', content: JSON.stringify(validated) }] };
  }
}