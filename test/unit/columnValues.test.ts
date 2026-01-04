/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 */

import {
  parseColumnValue,
  formatColumnValue,
  buildColumnValues,
  getClearValue,
} from '../../nodes/MondayCom/utils/columnValues';
import type { ColumnType } from '../../nodes/MondayCom/types';

describe('Column Value Utilities', () => {
  describe('parseColumnValue', () => {
    it('should parse status column value', () => {
      const value = JSON.stringify({ index: 1, label: 'Done' });
      const result = parseColumnValue('status' as ColumnType, value);
      expect(result).toEqual({ index: 1, label: 'Done' });
    });

    it('should parse text column value that is not JSON', () => {
      const value = 'Hello World';
      const result = parseColumnValue('text' as ColumnType, value);
      expect(result).toBe('Hello World');
    });

    it('should parse date column value', () => {
      const value = JSON.stringify({ date: '2024-01-15', time: '10:30:00' });
      const result = parseColumnValue('date' as ColumnType, value);
      expect(result).toEqual({ date: '2024-01-15', time: '10:30:00' });
    });

    it('should parse people column value', () => {
      const value = JSON.stringify({
        personsAndTeams: [
          { id: 123, kind: 'person' },
          { id: 456, kind: 'team' },
        ],
      });
      const result = parseColumnValue('people' as ColumnType, value);
      expect(result).toEqual({
        personsAndTeams: [
          { id: 123, kind: 'person' },
          { id: 456, kind: 'team' },
        ],
      });
    });

    it('should parse checkbox column value', () => {
      const value = JSON.stringify({ checked: 'true' });
      const result = parseColumnValue('checkbox' as ColumnType, value);
      expect(result).toEqual({ checked: 'true' });
    });

    it('should handle null value', () => {
      const result = parseColumnValue('text' as ColumnType, null);
      expect(result).toBeNull();
    });

    it('should handle empty string', () => {
      const result = parseColumnValue('text' as ColumnType, '');
      expect(result).toBeNull();
    });

    it('should handle invalid JSON gracefully', () => {
      const value = 'not valid json';
      const result = parseColumnValue('status' as ColumnType, value);
      expect(result).toBe('not valid json');
    });
  });

  describe('formatColumnValue', () => {
    it('should format status column value by index', () => {
      const result = formatColumnValue('status' as ColumnType, { index: 1 });
      expect(result).toBe('{"index":1}');
    });

    it('should format status column value by label', () => {
      const result = formatColumnValue('status' as ColumnType, { label: 'Done' });
      expect(result).toBe('{"label":"Done"}');
    });

    it('should format text column value as JSON string', () => {
      const result = formatColumnValue('text' as ColumnType, 'Hello World');
      expect(result).toBe('"Hello World"');
    });

    it('should format number column value as JSON string', () => {
      const result = formatColumnValue('numbers' as ColumnType, 42);
      expect(result).toBe('"42"');
    });

    it('should format date column value', () => {
      const result = formatColumnValue('date' as ColumnType, { date: '2024-01-15' });
      expect(JSON.parse(result)).toHaveProperty('date', '2024-01-15');
    });

    it('should format people column value', () => {
      const result = formatColumnValue('people' as ColumnType, { personsAndTeams: [{ id: 123, kind: 'person' }] });
      const parsed = JSON.parse(result);
      expect(parsed).toHaveProperty('personsAndTeams');
      expect(parsed.personsAndTeams[0]).toHaveProperty('id', 123);
    });

    it('should format checkbox column value', () => {
      const result = formatColumnValue('checkbox' as ColumnType, true);
      expect(result).toBe('{"checked":"true"}');
    });

    it('should format link column value', () => {
      const result = formatColumnValue('link' as ColumnType, { url: 'https://example.com', text: 'Example' });
      const parsed = JSON.parse(result);
      expect(parsed).toHaveProperty('url', 'https://example.com');
      expect(parsed).toHaveProperty('text', 'Example');
    });

    it('should format timeline column value', () => {
      const result = formatColumnValue('timeline' as ColumnType, { from: '2024-01-01', to: '2024-01-31' });
      const parsed = JSON.parse(result);
      expect(parsed).toHaveProperty('from', '2024-01-01');
      expect(parsed).toHaveProperty('to', '2024-01-31');
    });

    it('should format hour column value', () => {
      const result = formatColumnValue('hour' as ColumnType, { hour: 14, minute: 30 });
      const parsed = JSON.parse(result);
      expect(parsed).toHaveProperty('hour', 14);
      expect(parsed).toHaveProperty('minute', 30);
    });

    it('should format dropdown column value', () => {
      const result = formatColumnValue('dropdown' as ColumnType, { labels: ['Option 1', 'Option 2'] });
      const parsed = JSON.parse(result);
      expect(parsed).toHaveProperty('labels');
      expect(parsed.labels).toContain('Option 1');
    });
  });

  describe('buildColumnValues', () => {
    it('should build column values object', () => {
      const columns = [
        { columnId: 'status', value: { index: 1 }, columnType: 'status' as ColumnType },
        { columnId: 'text0', value: 'Hello', columnType: 'text' as ColumnType },
      ];
      const result = buildColumnValues(columns);
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('text0');
    });

    it('should handle empty array', () => {
      const result = buildColumnValues([]);
      expect(result).toEqual({});
    });

    it('should skip columns without columnId', () => {
      const columns = [
        { columnId: '', value: 'test', columnType: 'text' as ColumnType },
        { columnId: 'valid', value: 'test', columnType: 'text' as ColumnType },
      ];
      const result = buildColumnValues(columns);
      expect(result).not.toHaveProperty('');
      expect(result).toHaveProperty('valid');
    });
  });

  describe('getClearValue', () => {
    it('should return JSON empty string for text column', () => {
      const result = getClearValue('text' as ColumnType);
      expect(result).toBe('""');
    });

    it('should return JSON null index for status column', () => {
      const result = getClearValue('status' as ColumnType);
      expect(result).toBe('{"index":null}');
    });

    it('should return JSON empty string for numbers column', () => {
      const result = getClearValue('numbers' as ColumnType);
      expect(result).toBe('""');
    });

    it('should return JSON unchecked for checkbox column', () => {
      const result = getClearValue('checkbox' as ColumnType);
      expect(result).toBe('{"checked":"false"}');
    });

    it('should return JSON empty string for date column', () => {
      const result = getClearValue('date' as ColumnType);
      expect(result).toBe('""');
    });

    it('should return JSON empty people for people column', () => {
      const result = getClearValue('people' as ColumnType);
      expect(result).toBe('{"personsAndTeams":[]}');
    });

    it('should return JSON empty string for unknown column type', () => {
      // @ts-expect-error Testing unknown type handling
      const result = getClearValue('unknown_type');
      expect(result).toBe('""');
    });
  });
});
