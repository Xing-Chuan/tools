import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const expectedLinks = [
  'https://safe.woniu.com/safecenter/safe_bind.html',
  'https://safe.woniu.com/callcenter/self_help.html',
  'https://9yin.woniu.com/main.html',
  'https://safe.woniu.com/usercenter/mindex.html',
  'https://www.woniu.com/static/act/m/',
  'https://safe.woniu.com/safecenter/safe_liftItem.html',
  'https://www.woniu.com/static/act/snaildun/',
  'https://www.woniu.com/static/act/snailjishi/',
  'http://jishi.woniu.com/resources/9yin/toServerList.html',
];

async function readWorkbench() {
  return readFile(new URL('./jy-account-workbench.html', import.meta.url), 'utf8');
}

test('shows all nine requested direct-navigation links', async () => {
  const html = await readWorkbench();
  const links = [...html.matchAll(/data-target="([^"]+)"/g)].map((match) => match[1]);

  assert.deepEqual(links, expectedLinks);
  assert.match(html, /安全绑定/);
  assert.match(html, /更新安全手机、邮箱/);
  assert.match(html, /自助服务/);
  assert.doesNotMatch(html, /我的问题/);
});

test('provides one copy-link control per service and no progress ledger', async () => {
  const html = await readWorkbench();

  assert.equal((html.match(/class="copy-link"/g) ?? []).length, expectedLinks.length);
  assert.doesNotMatch(html, /本机进度簿|localStorage|标记为进行中/);
});

test('uses clean forward labels without decorative arrows', async () => {
  const html = await readWorkbench();

  assert.doesNotMatch(html, /前往 ↗/);
});

test('names the page 九阴事务台', async () => {
  const html = await readWorkbench();

  assert.match(html, /<h1>九阴事务台<\/h1>/);
  assert.match(html, /<title>九阴 · 事务台<\/title>/);
});
