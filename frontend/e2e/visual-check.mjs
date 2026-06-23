import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const OUT = 'D:\\Estudo\\ADS\\Final\\medidas-pessoais\\dev\\figma-ref\\resultado';
const email = `e2e-${Date.now()}@medidas.com`;
const VIEWPORT = process.argv[2] === 'desktop'
  ? { width: 1440, height: 900 }
  : { width: 430, height: 900 };
const PREFIX = process.argv[2] === 'desktop' ? 'desktop-' : '';

const failedRequests = [];

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: VIEWPORT });
await context.grantPermissions(['clipboard-read', 'clipboard-write']);
const page = await context.newPage();
page.on('response', (res) => {
  if (!res.ok()) failedRequests.push(`${res.status()} ${res.url()}`);
});
page.on('pageerror', (err) => failedRequests.push(`pageerror: ${err.message}`));

await page.goto(`${BASE}/cadastro`);
await page.waitForSelector('text=Criar conta');
await page.screenshot({ path: `${OUT}/${PREFIX}01-cadastro.png` });

await page.fill('input[name="nome"]', 'Teste E2E');
await page.fill('input[name="email"]', email);
await page.fill('input[name="senha"]', 'senha12345');
await page.fill('input[name="confirmarSenha"]', 'senha12345');
await page.click('button[type="submit"]');
await page.waitForURL('**/painel', { timeout: 10000 });
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/${PREFIX}03-painel-vazio.png` });

await page.goto(`${BASE}/login`);
await page.waitForSelector('text=Bem-vindo de volta');
await page.screenshot({ path: `${OUT}/${PREFIX}02-login.png` });

await page.goto(`${BASE}/painel`);
await page.waitForSelector('text=Cadastrar medidas');

await page.click('text=Cadastrar medidas');
await page.waitForURL('**/medidas/editar');
await page.fill('input[name="busto"]', '92');
await page.fill('input[name="torax"]', '88');
await page.fill('input[name="cintura"]', '74');
await page.fill('input[name="quadril"]', '98');
await page.fill('input[name="coxa"]', '56');
await page.fill('input[name="calcado"]', '38');
await page.screenshot({ path: `${OUT}/${PREFIX}04-formulario.png` });
await page.click('text=Salvar medidas');
await page.waitForURL('**/painel');
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/${PREFIX}03-painel-cheio.png` });

await page.click('text=SEU CÓDIGO DE ACESSO');
await page.waitForURL('**/codigo-acesso');
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/${PREFIX}05-codigo-acesso.png` });
await page.click('text=Copiar código');
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/${PREFIX}05-codigo-acesso-copiado.png` });

const clipboardText = await page.evaluate(() => navigator.clipboard.readText());

await browser.close();

console.log('FAILED_REQUESTS:', JSON.stringify(failedRequests, null, 2));
console.log('CLIPBOARD_TEXT:', clipboardText);
console.log('DONE');
