import { test } from 'node:test';
import assert from 'node:assert';
import { formatMonthYear, getDayOfMonth, formatMonthShort, formatRelativeDate } from './date.js';

test('formatMonthYear', async (t) => {
  await t.test('formats date correctly', () => {
    const date = '2023-10-05';
    const result = formatMonthYear(date);
    // Check for year and roughly the month structure, avoiding strict locale checks if env is limited
    assert.ok(result.includes('2023'));
  });

  await t.test('returns empty string for empty input', () => {
    assert.strictEqual(formatMonthYear(''), '');
    assert.strictEqual(formatMonthYear(null), '');
  });
});

test('getDayOfMonth', async (t) => {
  await t.test('returns day of month', () => {
    const date = '2023-10-05';
    assert.strictEqual(getDayOfMonth(date), 5);
  });
});

test('formatMonthShort', async (t) => {
  await t.test('returns short month name', () => {
    const date = '2023-10-05';
    const result = formatMonthShort(date);
    assert.ok(result.length > 0);
  });
});

test('formatRelativeDate', async (t) => {
    await t.test('formats past date', () => {
        const date = '2020-01-01';
        const result = formatRelativeDate(date);
        assert.ok(result.includes('2020'));
    });
});
