import { crypto } from 'crypto';
export async function invokeTool(toolId: string, payload: any, apiKey: string) {
  const urls = process.env.ROBOGATEWAY_URLS?.split(',') || ['https://rough-robo-link-azphy.base44.app/api/functions/invoke-tool'];
  const encKey = process.env.ROBOGATEWAY_ENCRYPTION_KEY;
  const processed = { ...payload };
  if (encKey) {
    for (const key in processed) {
      if (/secret|password|token|key|credential|ssn/i.test(key)) {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(encKey, 'hex'), iv);
        const enc = Buffer.concat([cipher.update(processed[key], 'utf8'), cipher.final()]);
        processed[key] = `enc:${iv.toString('hex')}:${enc.toString('hex')}:${cipher.getAuthTag().toString('hex')}`;
      }
    }
  }
  return { toolId, processed };
}