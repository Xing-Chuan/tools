import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  getService,
  getServices,
  isSafeExternalUrl,
} from './account-workbench.mjs';

test('exposes the five supported account-service journeys', () => {
  assert.deepEqual(
    getServices().map(({ id }) => id),
    ['phone', 'email', 'password', 'security-card', 'ticket'],
  );
});

test('phone journey directs users to the official self-service centre', () => {
  const journey = getService('phone');

  assert.equal(journey.title, '换绑手机');
  assert.equal(journey.url, 'https://safe.woniu.com/callcenter/self_help.html');
  assert.equal(journey.steps.length, 4);
  assert.match(journey.notice, /不输入密码/);
});

test('unknown journeys are not resolved', () => {
  assert.equal(getService('unknown'), undefined);
});

test('only https links to official Snail domains are allowed', () => {
  assert.equal(isSafeExternalUrl('https://safe.woniu.com/callcenter/self_help.html'), true);
  assert.equal(isSafeExternalUrl('https://support.woniu.com/'), true);
  assert.equal(isSafeExternalUrl('http://safe.woniu.com/'), false);
  assert.equal(isSafeExternalUrl('https://safe.woniu.com.evil.example/'), false);
});

test('the standalone HTML keeps all service cards visible without JavaScript modules', async () => {
  const html = await readFile(new URL('./jy-account-workbench.html', import.meta.url), 'utf8');
  const cards = html.match(/class="service"/g) ?? [];

  assert.equal(cards.length, 5);
  assert.match(html, /换绑手机/);
  assert.match(html, /提交工单/);
});
