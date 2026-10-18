import { BuilderCore } from './core.js';
import pino from 'pino';
const logger = pino();
const core = new BuilderCore();
try {
  const result = core.generate({ name: 'Syntex-Defense-Node', industry: 'Manufacturing' });
  console.log(JSON.stringify(result));
} catch (e) {
  logger.error(e, 'Builder execution failed');
  process.exit(1);
}