/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 */

import {
  MONDAY_COM_API_URL,
  MONDAY_COM_FILE_UPLOAD_URL,
  COMPLEXITY_LIMIT_PER_MINUTE,
  CURSOR_VALIDITY_MINUTES,
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
  RESOURCES,
  BOARD_OPERATIONS,
  ITEM_OPERATIONS,
  COLUMN_OPERATIONS,
  GROUP_OPERATIONS,
  WORKSPACE_OPERATIONS,
  USER_OPERATIONS,
  TEAM_OPERATIONS,
  UPDATE_OPERATIONS,
  TAG_OPERATIONS,
  FILE_OPERATIONS,
  NOTIFICATION_OPERATIONS,
  WEBHOOK_OPERATIONS,
  APP_OPERATIONS,
  ACCOUNT_OPERATIONS,
  DOC_OPERATIONS,
  FOLDER_OPERATIONS,
  COLUMN_TYPES,
  BOARD_KINDS,
  BOARD_STATES,
  WORKSPACE_KINDS,
  GROUP_COLORS,
  WEBHOOK_EVENT_TYPES,
} from '../../nodes/MondayCom/constants/constants';

describe('Constants', () => {
  describe('API URLs', () => {
    it('should have correct API URL', () => {
      expect(MONDAY_COM_API_URL).toBe('https://api.monday.com/v2');
    });

    it('should have correct file upload URL', () => {
      expect(MONDAY_COM_FILE_UPLOAD_URL).toBe('https://api.monday.com/v2/file');
    });
  });

  describe('Rate Limits', () => {
    it('should have correct complexity points limit', () => {
      expect(COMPLEXITY_LIMIT_PER_MINUTE).toBe(5000);
    });

    it('should have correct cursor validity', () => {
      expect(CURSOR_VALIDITY_MINUTES).toBe(60);
    });
  });

  describe('Pagination', () => {
    it('should have correct default page limit', () => {
      expect(DEFAULT_PAGE_LIMIT).toBe(50);
    });

    it('should have correct max page limit', () => {
      expect(MAX_PAGE_LIMIT).toBe(500);
    });
  });

  describe('Resources', () => {
    it('should have all 16 resources defined', () => {
      expect(RESOURCES).toHaveLength(16);
    });

    it('should include board resource', () => {
      const board = RESOURCES.find((r) => r.value === 'board');
      expect(board).toBeDefined();
      expect(board?.name).toBe('Board');
    });

    it('should include item resource', () => {
      const item = RESOURCES.find((r) => r.value === 'item');
      expect(item).toBeDefined();
      expect(item?.name).toBe('Item');
    });

    it('should include all expected resources', () => {
      const resourceValues = RESOURCES.map((r) => r.value);
      expect(resourceValues).toContain('board');
      expect(resourceValues).toContain('item');
      expect(resourceValues).toContain('column');
      expect(resourceValues).toContain('group');
      expect(resourceValues).toContain('workspace');
      expect(resourceValues).toContain('user');
      expect(resourceValues).toContain('team');
      expect(resourceValues).toContain('update');
      expect(resourceValues).toContain('tag');
      expect(resourceValues).toContain('file');
      expect(resourceValues).toContain('notification');
      expect(resourceValues).toContain('webhook');
      expect(resourceValues).toContain('app');
      expect(resourceValues).toContain('account');
      expect(resourceValues).toContain('doc');
      expect(resourceValues).toContain('folder');
    });
  });

  describe('Operations', () => {
    it('should have board operations', () => {
      expect(BOARD_OPERATIONS.length).toBeGreaterThan(0);
      const operationValues = BOARD_OPERATIONS.map((o) => o.value);
      expect(operationValues).toContain('listBoards');
      expect(operationValues).toContain('getBoard');
      expect(operationValues).toContain('createBoard');
    });

    it('should have item operations', () => {
      expect(ITEM_OPERATIONS.length).toBeGreaterThan(0);
      const operationValues = ITEM_OPERATIONS.map((o) => o.value);
      expect(operationValues).toContain('listItems');
      expect(operationValues).toContain('getItem');
      expect(operationValues).toContain('createItem');
    });

    it('should have column operations', () => {
      expect(COLUMN_OPERATIONS.length).toBeGreaterThan(0);
    });

    it('should have group operations', () => {
      expect(GROUP_OPERATIONS.length).toBeGreaterThan(0);
    });

    it('should have workspace operations', () => {
      expect(WORKSPACE_OPERATIONS.length).toBeGreaterThan(0);
    });

    it('should have user operations', () => {
      expect(USER_OPERATIONS.length).toBeGreaterThan(0);
    });

    it('should have team operations', () => {
      expect(TEAM_OPERATIONS.length).toBeGreaterThan(0);
    });

    it('should have update operations', () => {
      expect(UPDATE_OPERATIONS.length).toBeGreaterThan(0);
    });

    it('should have tag operations', () => {
      expect(TAG_OPERATIONS.length).toBeGreaterThan(0);
    });

    it('should have file operations', () => {
      expect(FILE_OPERATIONS.length).toBeGreaterThan(0);
    });

    it('should have notification operations', () => {
      expect(NOTIFICATION_OPERATIONS.length).toBeGreaterThan(0);
    });

    it('should have webhook operations', () => {
      expect(WEBHOOK_OPERATIONS.length).toBeGreaterThan(0);
    });

    it('should have app operations', () => {
      expect(APP_OPERATIONS.length).toBeGreaterThan(0);
    });

    it('should have account operations', () => {
      expect(ACCOUNT_OPERATIONS.length).toBeGreaterThan(0);
    });

    it('should have doc operations', () => {
      expect(DOC_OPERATIONS.length).toBeGreaterThan(0);
    });

    it('should have folder operations', () => {
      expect(FOLDER_OPERATIONS.length).toBeGreaterThan(0);
    });
  });

  describe('Column Types', () => {
    it('should have column types defined', () => {
      expect(COLUMN_TYPES.length).toBeGreaterThan(20);
    });

    it('should include common column types', () => {
      const typeValues = COLUMN_TYPES.map((t) => t.value);
      expect(typeValues).toContain('status');
      expect(typeValues).toContain('text');
      expect(typeValues).toContain('numbers');
      expect(typeValues).toContain('date');
      expect(typeValues).toContain('people');
      expect(typeValues).toContain('checkbox');
      expect(typeValues).toContain('dropdown');
      expect(typeValues).toContain('link');
      expect(typeValues).toContain('file');
      expect(typeValues).toContain('timeline');
    });
  });

  describe('Board Kinds', () => {
    it('should have board kinds defined', () => {
      expect(BOARD_KINDS.length).toBe(3);
    });

    it('should include all board kinds', () => {
      const kindValues = BOARD_KINDS.map((k) => k.value);
      expect(kindValues).toContain('public');
      expect(kindValues).toContain('private');
      expect(kindValues).toContain('share');
    });
  });

  describe('Board States', () => {
    it('should have board states defined', () => {
      expect(BOARD_STATES.length).toBe(4);
    });

    it('should include all board states', () => {
      const stateValues = BOARD_STATES.map((s) => s.value);
      expect(stateValues).toContain('active');
      expect(stateValues).toContain('archived');
      expect(stateValues).toContain('deleted');
      expect(stateValues).toContain('all');
    });
  });

  describe('Workspace Kinds', () => {
    it('should have workspace kinds defined', () => {
      expect(WORKSPACE_KINDS.length).toBe(2);
    });

    it('should include all workspace kinds', () => {
      const kindValues = WORKSPACE_KINDS.map((k) => k.value);
      expect(kindValues).toContain('open');
      expect(kindValues).toContain('closed');
    });
  });

  describe('Group Colors', () => {
    it('should have group colors defined', () => {
      expect(GROUP_COLORS.length).toBeGreaterThan(0);
    });

    it('should have valid hex color values', () => {
      GROUP_COLORS.forEach((color) => {
        expect(color.value).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });

  describe('Webhook Event Types', () => {
    it('should have webhook event types defined', () => {
      expect(WEBHOOK_EVENT_TYPES.length).toBeGreaterThan(10);
    });

    it('should include common event types', () => {
      const eventValues = WEBHOOK_EVENT_TYPES.map((e) => e.value);
      expect(eventValues).toContain('create_item');
      expect(eventValues).toContain('change_column_value');
      expect(eventValues).toContain('create_update');
    });
  });
});
