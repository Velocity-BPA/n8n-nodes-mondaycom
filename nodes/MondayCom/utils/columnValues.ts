/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';
import type { ColumnType } from '../types';

/**
 * Parse a column value from Monday.com's JSON string format
 */
export function parseColumnValue(_type: ColumnType, value: string | null): IDataObject | string | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value);
    return parsed;
  } catch {
    return value;
  }
}

/**
 * Format a value for Monday.com's column value format
 */
export function formatColumnValue(type: ColumnType, value: unknown): string {
  switch (type) {
    case 'status':
      return formatStatusValue(value);
    case 'text':
    case 'long_text':
      return formatTextValue(value);
    case 'numbers':
      return formatNumberValue(value);
    case 'date':
      return formatDateValue(value);
    case 'people':
      return formatPeopleValue(value);
    case 'dropdown':
      return formatDropdownValue(value);
    case 'checkbox':
      return formatCheckboxValue(value);
    case 'link':
      return formatLinkValue(value);
    case 'timeline':
      return formatTimelineValue(value);
    case 'hour':
      return formatHourValue(value);
    case 'email':
      return formatEmailValue(value);
    case 'phone':
      return formatPhoneValue(value);
    case 'rating':
      return formatRatingValue(value);
    case 'tags':
      return formatTagsValue(value);
    case 'country':
      return formatCountryValue(value);
    case 'location':
      return formatLocationValue(value);
    case 'world_clock':
      return formatWorldClockValue(value);
    case 'week':
      return formatWeekValue(value);
    default:
      return JSON.stringify(value);
  }
}

/**
 * Format status column value
 * Accepts: { index: number } or { label: string }
 */
function formatStatusValue(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    const obj = value as IDataObject;
    if ('index' in obj) {
      return JSON.stringify({ index: obj.index });
    }
    if ('label' in obj) {
      return JSON.stringify({ label: obj.label });
    }
  }
  if (typeof value === 'string') {
    return JSON.stringify({ label: value });
  }
  if (typeof value === 'number') {
    return JSON.stringify({ index: value });
  }
  return JSON.stringify(value);
}

/**
 * Format text column value
 */
function formatTextValue(value: unknown): string {
  return JSON.stringify(String(value));
}

/**
 * Format number column value
 */
function formatNumberValue(value: unknown): string {
  return JSON.stringify(String(Number(value)));
}

/**
 * Format date column value
 * Accepts: { date: string, time?: string }
 */
function formatDateValue(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    const obj = value as IDataObject;
    const result: IDataObject = { date: obj.date };
    if (obj.time) {
      result.time = obj.time;
    }
    return JSON.stringify(result);
  }
  if (typeof value === 'string') {
    return JSON.stringify({ date: value });
  }
  return JSON.stringify(value);
}

/**
 * Format people column value
 * Accepts: { personsAndTeams: [{ id: number, kind?: 'person' | 'team' }] }
 */
function formatPeopleValue(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    const obj = value as IDataObject;
    if ('personsAndTeams' in obj) {
      return JSON.stringify(obj);
    }
    if (Array.isArray(obj)) {
      const personsAndTeams = obj.map((item) => {
        if (typeof item === 'number') {
          return { id: item, kind: 'person' };
        }
        return item;
      });
      return JSON.stringify({ personsAndTeams });
    }
  }
  if (typeof value === 'number') {
    return JSON.stringify({ personsAndTeams: [{ id: value, kind: 'person' }] });
  }
  return JSON.stringify(value);
}

/**
 * Format dropdown column value
 * Accepts: { labels: string[] } or { ids: number[] }
 */
function formatDropdownValue(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    const obj = value as IDataObject;
    if ('labels' in obj || 'ids' in obj) {
      return JSON.stringify(obj);
    }
    if (Array.isArray(obj)) {
      return JSON.stringify({ labels: obj });
    }
  }
  if (typeof value === 'string') {
    return JSON.stringify({ labels: [value] });
  }
  return JSON.stringify(value);
}

/**
 * Format checkbox column value
 * Accepts: { checked: 'true' | 'false' } or boolean
 */
function formatCheckboxValue(value: unknown): string {
  if (typeof value === 'boolean') {
    return JSON.stringify({ checked: value ? 'true' : 'false' });
  }
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }
  return JSON.stringify({ checked: value ? 'true' : 'false' });
}

/**
 * Format link column value
 * Accepts: { url: string, text?: string }
 */
function formatLinkValue(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    const obj = value as IDataObject;
    const result: IDataObject = { url: obj.url };
    if (obj.text) {
      result.text = obj.text;
    }
    return JSON.stringify(result);
  }
  if (typeof value === 'string') {
    return JSON.stringify({ url: value });
  }
  return JSON.stringify(value);
}

/**
 * Format timeline column value
 * Accepts: { from: string, to: string }
 */
function formatTimelineValue(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    const obj = value as IDataObject;
    return JSON.stringify({ from: obj.from, to: obj.to });
  }
  return JSON.stringify(value);
}

/**
 * Format hour column value
 * Accepts: { hour: number, minute: number }
 */
function formatHourValue(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    const obj = value as IDataObject;
    return JSON.stringify({ hour: obj.hour, minute: obj.minute || 0 });
  }
  return JSON.stringify(value);
}

/**
 * Format email column value
 * Accepts: { email: string, text?: string }
 */
function formatEmailValue(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    const obj = value as IDataObject;
    const result: IDataObject = { email: obj.email };
    if (obj.text) {
      result.text = obj.text;
    }
    return JSON.stringify(result);
  }
  if (typeof value === 'string') {
    return JSON.stringify({ email: value, text: value });
  }
  return JSON.stringify(value);
}

/**
 * Format phone column value
 * Accepts: { phone: string, countryShortName?: string }
 */
function formatPhoneValue(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    const obj = value as IDataObject;
    const result: IDataObject = { phone: obj.phone };
    if (obj.countryShortName) {
      result.countryShortName = obj.countryShortName;
    }
    return JSON.stringify(result);
  }
  if (typeof value === 'string') {
    return JSON.stringify({ phone: value });
  }
  return JSON.stringify(value);
}

/**
 * Format rating column value
 * Accepts: { rating: number } or number
 */
function formatRatingValue(value: unknown): string {
  if (typeof value === 'number') {
    return JSON.stringify({ rating: value });
  }
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }
  return JSON.stringify(value);
}

/**
 * Format tags column value
 * Accepts: { tag_ids: number[] }
 */
function formatTagsValue(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    const obj = value as IDataObject;
    if ('tag_ids' in obj) {
      return JSON.stringify(obj);
    }
    if (Array.isArray(obj)) {
      return JSON.stringify({ tag_ids: obj });
    }
  }
  return JSON.stringify(value);
}

/**
 * Format country column value
 * Accepts: { countryCode: string, countryName: string }
 */
function formatCountryValue(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }
  if (typeof value === 'string') {
    return JSON.stringify({ countryCode: value });
  }
  return JSON.stringify(value);
}

/**
 * Format location column value
 * Accepts: { lat: number, lng: number, address?: string }
 */
function formatLocationValue(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }
  return JSON.stringify(value);
}

/**
 * Format world clock column value
 * Accepts: { timezone: string }
 */
function formatWorldClockValue(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }
  if (typeof value === 'string') {
    return JSON.stringify({ timezone: value });
  }
  return JSON.stringify(value);
}

/**
 * Format week column value
 * Accepts: { week: { startDate: string, endDate: string } }
 */
function formatWeekValue(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    const obj = value as IDataObject;
    if ('week' in obj) {
      return JSON.stringify(obj);
    }
    if ('startDate' in obj && 'endDate' in obj) {
      return JSON.stringify({ week: obj });
    }
  }
  return JSON.stringify(value);
}

/**
 * Build column values object from n8n input
 */
export function buildColumnValues(inputs: IDataObject[]): IDataObject {
  const columnValues: IDataObject = {};

  for (const input of inputs) {
    const columnId = input.columnId as string;
    const columnType = input.columnType as ColumnType;
    const value = input.value;

    if (columnId && value !== undefined && value !== null) {
      const formattedValue = formatColumnValue(columnType, value);
      columnValues[columnId] = JSON.parse(formattedValue);
    }
  }

  return columnValues;
}

/**
 * Parse all column values from an item response
 */
export function parseAllColumnValues(columnValues: Array<{ id: string; type: string; text?: string; value?: string }>): IDataObject {
  const result: IDataObject = {};

  for (const col of columnValues) {
    result[col.id] = {
      type: col.type,
      text: col.text,
      value: col.value ? parseColumnValue(col.type as ColumnType, col.value) : null,
    };
  }

  return result;
}

/**
 * Clear a column value (set to null/empty)
 */
export function getClearValue(type: ColumnType): string {
  switch (type) {
    case 'checkbox':
      return JSON.stringify({ checked: 'false' });
    case 'status':
      return JSON.stringify({ index: null });
    case 'people':
      return JSON.stringify({ personsAndTeams: [] });
    case 'dropdown':
      return JSON.stringify({ labels: [] });
    case 'tags':
      return JSON.stringify({ tag_ids: [] });
    default:
      return JSON.stringify('');
  }
}
