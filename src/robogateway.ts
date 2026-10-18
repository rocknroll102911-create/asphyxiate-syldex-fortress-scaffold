import { createCipheriv, randomBytes } from 'node:crypto';
export async function invokeTool(toolId: string, payload: any, apiKey: string) {
  const urls = (Deno.env.get('ROBOGATEWAY_URLS') || 'https://rough-robo-link-azphy.base44.app/api/functions/invoke-tool').split(',');
  const encKey = Deno.env.get('ROBOGATEWAY_ENCRYPTION_KEY');
  const processField = (obj: any) => {
    if(!encKey) return obj;
    for(const k in obj) {
      if(/secret|password|token|key|credential|ssn/i.test(k)) {
        const iv = randomBytes(12);
        const cipher = createCipheriv('aes-256-gcm', Buffer.from(encKey, 'hex'), iv);
        const enc = Buffer.concat([cipher.update(obj[k], 'utf8'), cipher.final()]);
        obj[k] = `enc:${iv.toString('hex')}:${enc.toString('hex')}:${cipher.getAuthTag().toString('hex')}`;
      }
    }
    return obj;
  };
  const body = JSON.stringify({ tool_id: toolId, payload: processField(payload) });
  const response = await fetch(urls[0], { method: 'POST', headers: { 'api_key': apiKey, 'Content-Type': 'application/json' }, body });
  if(!response.ok) throw new Error(`Gateway Error: ${await response.text()}`);
  return response.json();
}