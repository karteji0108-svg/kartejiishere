import test from 'node:test';
import assert from 'node:assert';
import {
  formatDate,
  formatMonthYear,
  getDay,
  getMonthShort,
  formatFullDate,
  formatFullDateWithDay,
  formatDateShort,
  formatAnnouncementsDate,
  formatDateDefault
} from './date.js';

test('date utilities', async (t) => {
  const dateStr = '2024-01-01T00:00:00Z'; // 1 Januari 2024 (Senin in GMT)

  await t.test('formatMonthYear', () => {
    const result = formatMonthYear(dateStr);
    assert.match(result, /Januari 2024/);
  });

  await t.test('getDay', () => {
    const result = getDay(dateStr);
    // Note: getDay() returns the day of the month
    assert.strictEqual(result, 1);
  });

  await t.test('getMonthShort', () => {
    const result = getMonthShort(dateStr);
    assert.match(result, /Jan/);
  });

  await t.test('formatFullDate', () => {
    const result = formatFullDate(dateStr);
    assert.match(result, /1 Januari 2024/);
  });

  await t.test('formatFullDateWithDay', () => {
    const result = formatFullDateWithDay(dateStr);
    assert.match(result, /Senin/);
    assert.match(result, /1 Januari 2024/);
  });

  await t.test('formatDateShort', () => {
    const result = formatDateShort(dateStr);
    assert.match(result, /01 Jan 2024/);
  });

  await t.test('formatAnnouncementsDate - today', () => {
    const today = new Date().toISOString();
    const result = formatAnnouncementsDate(today);
    assert.match(result, /Hari ini/);
  });

  await t.test('formatAnnouncementsDate - other day', () => {
    const result = formatAnnouncementsDate(dateStr);
    assert.match(result, /1 Jan 2024/);
  });

  await t.test('formatDateDefault', () => {
    const result = formatDateDefault(dateStr);
    assert.ok(result);
  });
});
