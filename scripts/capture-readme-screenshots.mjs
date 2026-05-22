import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const dotenv = require('../server/node_modules/dotenv');
const mongoose = require('../server/node_modules/mongoose');
const User = require('../server/models/User');
const Product = require('../server/models/Product');
const Sale = require('../server/models/Sale');

dotenv.config({ path: path.resolve('server/.env') });

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.resolve('docs/screenshots');
const userDataDir = path.resolve('.tmp/chrome-readme-screenshots');
const baseUrl = 'http://localhost:3000';
const apiUrl = 'http://localhost:5000/api';
const port = 9225;

let chrome;
let ws;
let seq = 1;
const pending = new Map();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

async function postJson(url, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = http.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function waitForChrome() {
  for (let i = 0; i < 50; i += 1) {
    try {
      const targets = await getJson(`http://localhost:${port}/json/list`);
      const page = targets.find((target) => target.type === 'page' && target.webSocketDebuggerUrl);
      if (page) return page.webSocketDebuggerUrl;
    } catch {
      await delay(200);
    }
  }
  throw new Error('Chrome DevTools endpoint did not become available.');
}

async function connect(wsUrl) {
  ws = new WebSocket(wsUrl);
  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    }
  });
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
}

function send(method, params = {}) {
  const id = seq;
  seq += 1;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
  });
}

async function setupPage(token, user) {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      localStorage.setItem('smartstore_token', ${JSON.stringify(token)});
      localStorage.setItem('smartstore_user', ${JSON.stringify(JSON.stringify(user))});
    `,
  });
}

async function navigate(url) {
  await send('Page.navigate', { url });
  await delay(2600);
}

async function screenshot(fileName) {
  const result = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
    fromSurface: true,
  });
  await writeFile(path.join(outDir, fileName), Buffer.from(result.data, 'base64'));
}

async function clickByText(text) {
  await send('Runtime.evaluate', {
    expression: `
      [...document.querySelectorAll('button')]
        .find((button) => button.textContent.trim().includes(${JSON.stringify(text)}))
        ?.click();
    `,
  });
  await delay(900);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderDbHtml(title, docs) {
  const rows = docs.map((doc) => {
    const json = JSON.stringify(doc, null, 2);
    return `<article><pre>${escapeHtml(json)}</pre></article>`;
  }).join('');

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      margin: 0;
      background: #061b24;
      color: #e8fbff;
      font: 15px/1.5 Consolas, "SFMono-Regular", monospace;
    }
    header {
      padding: 28px 36px;
      border-bottom: 1px solid rgba(125, 211, 252, .18);
      background: #0f2530;
    }
    h1 {
      margin: 0;
      font: 800 30px Arial, sans-serif;
      letter-spacing: .2px;
    }
    p {
      margin: 6px 0 0;
      color: #7dd3fc;
      font: 600 14px Arial, sans-serif;
    }
    main {
      padding: 28px 36px 44px;
      display: grid;
      gap: 16px;
    }
    article {
      border: 1px solid rgba(125, 211, 252, .25);
      border-radius: 10px;
      background: #082936;
      box-shadow: 0 18px 40px rgba(0, 0, 0, .25);
      overflow: hidden;
    }
    pre {
      margin: 0;
      padding: 22px 26px;
      white-space: pre-wrap;
      color: #31f2a6;
    }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(title)}</h1>
    <p>MongoDB database: smartstore</p>
  </header>
  <main>${rows}</main>
</body>
</html>`;
}

async function captureDbScreenshots() {
  await mongoose.connect(process.env.MONGO_URI);

  const users = await User.find({}).select('-password').limit(2).lean();
  const products = await Product.find({}).limit(3).lean();
  const sales = await Sale.find({}).limit(4).lean();
  await mongoose.disconnect();

  const pages = [
    ['db-users.html', 'Users Collection', users, 'db-users.png'],
    ['db-products.html', 'Products Collection', products, 'db-products.png'],
    ['db-sales.html', 'Sales Collection', sales, 'db-sales.png'],
  ];

  for (const [htmlName, title, docs, imageName] of pages) {
    const htmlPath = path.join(outDir, htmlName);
    await writeFile(htmlPath, renderDbHtml(title, docs));
    await navigate(pathToFileURL(htmlPath).href);
    await screenshot(imageName);
  }
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await mkdir(userDataDir, { recursive: true });

  const login = await postJson(`${apiUrl}/auth/login`, {
    email: 'demo@smartstore.com',
    password: 'password123',
  });
  if (!login.success) throw new Error('Demo login failed.');

  chrome = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    'about:blank',
  ], { stdio: 'ignore' });

  const wsUrl = await waitForChrome();
  await connect(wsUrl);
  await setupPage(login.token, login.user);

  await navigate(`${baseUrl}/`);
  await screenshot('dashboard.png');

  await navigate(`${baseUrl}/products`);
  await screenshot('products.png');

  await navigate(`${baseUrl}/ai-generator`);
  await screenshot('ai-generator.png');

  await navigate(`${baseUrl}/analytics`);
  await clickByText('WEEKLY');
  await screenshot('analytics-weekly.png');
  await clickByText('DAILY');
  await screenshot('analytics-daily.png');

  await navigate(`${baseUrl}/ai-suggestions`);
  await screenshot('ai-suggestions.png');

  await navigate(`${baseUrl}/inventory`);
  await screenshot('inventory-alerts.png');

  await captureDbScreenshots();
  ws.close();
  chrome.kill();
}

main().catch((error) => {
  console.error(error);
  if (ws) ws.close();
  if (chrome) chrome.kill();
  process.exit(1);
});
