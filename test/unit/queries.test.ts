/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 */

import {
  boardQueries,
  boardMutations,
  itemQueries,
  itemMutations,
} from '../../nodes/MondayCom/utils/queries';

describe('GraphQL Query Builders', () => {
  describe('Board Queries', () => {
    describe('listBoards', () => {
      it('should generate basic list boards query', () => {
        const query = boardQueries.listBoards(50);
        expect(query).toContain('query');
        expect(query).toContain('boards');
        expect(query).toContain('id');
        expect(query).toContain('name');
      });

      it('should include limit parameter', () => {
        const query = boardQueries.listBoards(25);
        expect(query).toContain('limit: 25');
      });
    });

    describe('getBoard', () => {
      it('should generate get board query with ID', () => {
        const query = boardQueries.getBoard('123456');
        expect(query).toContain('boards(ids: [123456])');
        expect(query).toContain('id');
        expect(query).toContain('name');
        expect(query).toContain('description');
      });
    });
  });

  describe('Board Mutations', () => {
    describe('createBoard', () => {
      it('should generate create board mutation', () => {
        const mutation = boardMutations.createBoard('Test Board', 'public');
        expect(mutation).toContain('mutation');
        expect(mutation).toContain('create_board');
        expect(mutation).toContain('board_name: "Test Board"');
        expect(mutation).toContain('board_kind: public');
      });

      it('should include workspace_id when provided', () => {
        const mutation = boardMutations.createBoard('Test Board', 'public', '789');
        expect(mutation).toContain('workspace_id: 789');
      });
    });

    describe('duplicateBoard', () => {
      it('should generate duplicate board mutation', () => {
        const mutation = boardMutations.duplicateBoard('123', 'duplicate_board_with_structure');
        expect(mutation).toContain('mutation');
        expect(mutation).toContain('duplicate_board');
        expect(mutation).toContain('board_id: 123');
      });

      it('should include duplicate_type when provided', () => {
        const mutation = boardMutations.duplicateBoard('123', 'duplicate_board_with_structure');
        expect(mutation).toContain('duplicate_type: duplicate_board_with_structure');
      });
    });

    describe('archiveBoard', () => {
      it('should generate archive board mutation', () => {
        const mutation = boardMutations.archiveBoard('123');
        expect(mutation).toContain('mutation');
        expect(mutation).toContain('archive_board');
        expect(mutation).toContain('board_id: 123');
      });
    });

    describe('deleteBoard', () => {
      it('should generate delete board mutation', () => {
        const mutation = boardMutations.deleteBoard('123');
        expect(mutation).toContain('mutation');
        expect(mutation).toContain('delete_board');
        expect(mutation).toContain('board_id: 123');
      });
    });
  });

  describe('Item Queries', () => {
    describe('listItems', () => {
      it('should generate list items query with item IDs', () => {
        const query = itemQueries.listItems(['123', '456']);
        expect(query).toContain('items(ids: [123, 456])');
        expect(query).toContain('id');
        expect(query).toContain('name');
      });
    });

    describe('getItem', () => {
      it('should generate get item query with ID', () => {
        const query = itemQueries.getItem('456');
        expect(query).toContain('items(ids: [456])');
        expect(query).toContain('id');
        expect(query).toContain('name');
        expect(query).toContain('column_values');
      });
    });
  });

  describe('Item Mutations', () => {
    describe('createItem', () => {
      it('should generate create item mutation', () => {
        const mutation = itemMutations.createItem('123', 'New Item');
        expect(mutation).toContain('mutation');
        expect(mutation).toContain('create_item');
        expect(mutation).toContain('board_id: 123');
        expect(mutation).toContain('item_name: "New Item"');
      });

      it('should include group_id when provided', () => {
        const mutation = itemMutations.createItem('123', 'New Item', 'group1');
        expect(mutation).toContain('group_id: "group1"');
      });
    });

    describe('archiveItem', () => {
      it('should generate archive item mutation', () => {
        const mutation = itemMutations.archiveItem('456');
        expect(mutation).toContain('mutation');
        expect(mutation).toContain('archive_item');
        expect(mutation).toContain('item_id: 456');
      });
    });

    describe('deleteItem', () => {
      it('should generate delete item mutation', () => {
        const mutation = itemMutations.deleteItem('456');
        expect(mutation).toContain('mutation');
        expect(mutation).toContain('delete_item');
        expect(mutation).toContain('item_id: 456');
      });
    });
  });
});
