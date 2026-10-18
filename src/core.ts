import { z } from 'zod';
export class BuilderCore {
  private schema = z.object({ target: z.string(), modules: z.array(z.string()) });
  generate(input: unknown) {
    const data = this.schema.parse(input);
    return { status: 'success', scaffolding: data };
  }
}