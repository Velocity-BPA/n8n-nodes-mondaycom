/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

// Board Queries
export const boardQueries = {
  listBoards: (limit: number, page?: number) => `
    query {
      boards(limit: ${limit}${page ? `, page: ${page}` : ''}) {
        id
        name
        description
        board_kind
        state
        workspace_id
        updated_at
        permissions
        owner {
          id
          name
          email
        }
      }
    }
  `,

  getBoard: (boardId: string) => `
    query {
      boards(ids: [${boardId}]) {
        id
        name
        description
        board_kind
        state
        workspace_id
        updated_at
        permissions
        owner {
          id
          name
          email
        }
        columns {
          id
          title
          type
          description
          settings_str
        }
        groups {
          id
          title
          color
          position
        }
      }
    }
  `,

  getBoardColumns: (boardId: string) => `
    query {
      boards(ids: [${boardId}]) {
        columns {
          id
          title
          type
          description
          settings_str
          archived
          width
        }
      }
    }
  `,

  getBoardGroups: (boardId: string) => `
    query {
      boards(ids: [${boardId}]) {
        groups {
          id
          title
          color
          position
          archived
          deleted
        }
      }
    }
  `,

  getBoardItems: (boardId: string, limit: number, cursor?: string) => `
    query {
      boards(ids: [${boardId}]) {
        items_page(limit: ${limit}${cursor ? `, cursor: "${cursor}"` : ''}) {
          cursor
          items {
            id
            name
            state
            created_at
            updated_at
            group {
              id
              title
            }
            column_values {
              id
              type
              text
              value
            }
          }
        }
      }
    }
  `,

  getBoardViews: (boardId: string) => `
    query {
      boards(ids: [${boardId}]) {
        views {
          id
          name
          type
          settings_str
        }
      }
    }
  `,

  getBoardActivity: (boardId: string, limit: number, page?: number) => `
    query {
      boards(ids: [${boardId}]) {
        activity_logs(limit: ${limit}${page ? `, page: ${page}` : ''}) {
          id
          event
          data
          entity
          user_id
          created_at
        }
      }
    }
  `,
};

// Board Mutations
export const boardMutations = {
  createBoard: (name: string, boardKind: string, workspaceId?: string, templateId?: string) => `
    mutation {
      create_board(
        board_name: "${escapeString(name)}"
        board_kind: ${boardKind}
        ${workspaceId ? `workspace_id: ${workspaceId}` : ''}
        ${templateId ? `template_id: ${templateId}` : ''}
      ) {
        id
        name
        board_kind
        state
        workspace_id
      }
    }
  `,

  duplicateBoard: (boardId: string, duplicateType: string, boardName?: string, workspaceId?: string) => `
    mutation {
      duplicate_board(
        board_id: ${boardId}
        duplicate_type: ${duplicateType}
        ${boardName ? `board_name: "${escapeString(boardName)}"` : ''}
        ${workspaceId ? `workspace_id: ${workspaceId}` : ''}
      ) {
        board {
          id
          name
          board_kind
          state
          workspace_id
        }
      }
    }
  `,

  archiveBoard: (boardId: string) => `
    mutation {
      archive_board(board_id: ${boardId}) {
        id
        name
        state
      }
    }
  `,

  deleteBoard: (boardId: string) => `
    mutation {
      delete_board(board_id: ${boardId}) {
        id
      }
    }
  `,

  updateBoardColumn: (boardId: string, columnId: string, title?: string, _description?: string) => `
    mutation {
      change_column_title(
        board_id: ${boardId}
        column_id: "${columnId}"
        ${title ? `title: "${escapeString(title)}"` : ''}
      ) {
        id
        title
        description
      }
    }
  `,

  addBoardSubscriber: (boardId: string, userId: string, kind?: string) => `
    mutation {
      add_subscribers_to_board(
        board_id: ${boardId}
        user_ids: [${userId}]
        ${kind ? `kind: ${kind}` : ''}
      ) {
        id
        name
        email
      }
    }
  `,

  removeBoardSubscriber: (boardId: string, userId: string) => `
    mutation {
      delete_subscribers_from_board(
        board_id: ${boardId}
        user_ids: [${userId}]
      ) {
        id
        name
        email
      }
    }
  `,
};

// Item Queries
export const itemQueries = {
  listItems: (itemIds: string[]) => `
    query {
      items(ids: [${itemIds.join(', ')}]) {
        id
        name
        state
        created_at
        updated_at
        board {
          id
          name
        }
        group {
          id
          title
        }
        column_values {
          id
          type
          text
          value
        }
      }
    }
  `,

  getItem: (itemId: string) => `
    query {
      items(ids: [${itemId}]) {
        id
        name
        state
        created_at
        updated_at
        creator_id
        board {
          id
          name
        }
        group {
          id
          title
        }
        column_values {
          id
          type
          text
          value
          column {
            id
            title
          }
        }
        subitems {
          id
          name
        }
        parent_item {
          id
          name
        }
      }
    }
  `,

  getItemColumnValues: (itemId: string) => `
    query {
      items(ids: [${itemId}]) {
        column_values {
          id
          type
          text
          value
          column {
            id
            title
            type
            settings_str
          }
        }
      }
    }
  `,

  getItemSubitems: (itemId: string) => `
    query {
      items(ids: [${itemId}]) {
        subitems {
          id
          name
          state
          created_at
          updated_at
          column_values {
            id
            type
            text
            value
          }
        }
      }
    }
  `,

  getItemUpdates: (itemId: string, limit: number, page?: number) => `
    query {
      items(ids: [${itemId}]) {
        updates(limit: ${limit}${page ? `, page: ${page}` : ''}) {
          id
          body
          text_body
          created_at
          updated_at
          creator_id
          creator {
            id
            name
          }
        }
      }
    }
  `,

  getLinkedItems: (itemId: string, _columnId: string) => `
    query {
      items(ids: [${itemId}]) {
        linked_items(linked_board_id: null) {
          id
          name
          board {
            id
            name
          }
        }
      }
    }
  `,
};

// Item Mutations
export const itemMutations = {
  createItem: (boardId: string, itemName: string, groupId?: string, columnValues?: IDataObject, createLabels?: boolean) => `
    mutation {
      create_item(
        board_id: ${boardId}
        item_name: "${escapeString(itemName)}"
        ${groupId ? `group_id: "${groupId}"` : ''}
        ${columnValues ? `column_values: ${formatColumnValues(columnValues)}` : ''}
        ${createLabels !== undefined ? `create_labels_if_missing: ${createLabels}` : ''}
      ) {
        id
        name
        state
        created_at
        group {
          id
          title
        }
        column_values {
          id
          type
          text
          value
        }
      }
    }
  `,

  duplicateItem: (boardId: string, itemId: string, withUpdates?: boolean) => `
    mutation {
      duplicate_item(
        board_id: ${boardId}
        item_id: ${itemId}
        ${withUpdates !== undefined ? `with_updates: ${withUpdates}` : ''}
      ) {
        id
        name
        state
      }
    }
  `,

  moveItemToGroup: (itemId: string, groupId: string) => `
    mutation {
      move_item_to_group(
        item_id: ${itemId}
        group_id: "${groupId}"
      ) {
        id
        name
        group {
          id
          title
        }
      }
    }
  `,

  moveItemToBoard: (boardId: string, itemId: string, groupId: string) => `
    mutation {
      move_item_to_board(
        board_id: ${boardId}
        item_id: ${itemId}
        group_id: "${groupId}"
      ) {
        id
        name
        board {
          id
          name
        }
      }
    }
  `,

  archiveItem: (itemId: string) => `
    mutation {
      archive_item(item_id: ${itemId}) {
        id
        state
      }
    }
  `,

  deleteItem: (itemId: string) => `
    mutation {
      delete_item(item_id: ${itemId}) {
        id
      }
    }
  `,

  changeItemColumnValue: (boardId: string, itemId: string, columnId: string, value: string, createLabels?: boolean) => `
    mutation {
      change_column_value(
        board_id: ${boardId}
        item_id: ${itemId}
        column_id: "${columnId}"
        value: ${value}
        ${createLabels !== undefined ? `create_labels_if_missing: ${createLabels}` : ''}
      ) {
        id
        name
        column_values {
          id
          type
          text
          value
        }
      }
    }
  `,

  changeMultipleColumnValues: (boardId: string, itemId: string, columnValues: IDataObject, createLabels?: boolean) => `
    mutation {
      change_multiple_column_values(
        board_id: ${boardId}
        item_id: ${itemId}
        column_values: ${formatColumnValues(columnValues)}
        ${createLabels !== undefined ? `create_labels_if_missing: ${createLabels}` : ''}
      ) {
        id
        name
        column_values {
          id
          type
          text
          value
        }
      }
    }
  `,

  clearItemUpdates: (itemId: string) => `
    mutation {
      clear_item_updates(item_id: ${itemId}) {
        id
      }
    }
  `,

  createSubitem: (parentItemId: string, itemName: string, columnValues?: IDataObject, createLabels?: boolean) => `
    mutation {
      create_subitem(
        parent_item_id: ${parentItemId}
        item_name: "${escapeString(itemName)}"
        ${columnValues ? `column_values: ${formatColumnValues(columnValues)}` : ''}
        ${createLabels !== undefined ? `create_labels_if_missing: ${createLabels}` : ''}
      ) {
        id
        name
        state
        board {
          id
        }
        column_values {
          id
          type
          text
          value
        }
      }
    }
  `,
};

// Column Queries
export const columnQueries = {
  listColumns: (boardId: string) => `
    query {
      boards(ids: [${boardId}]) {
        columns {
          id
          title
          type
          description
          settings_str
          archived
          width
        }
      }
    }
  `,

  getColumn: (boardId: string, columnId: string) => `
    query {
      boards(ids: [${boardId}]) {
        columns(ids: ["${columnId}"]) {
          id
          title
          type
          description
          settings_str
          archived
          width
        }
      }
    }
  `,
};

// Column Mutations
export const columnMutations = {
  createColumn: (boardId: string, title: string, columnType: string, defaults?: IDataObject, description?: string) => `
    mutation {
      create_column(
        board_id: ${boardId}
        title: "${escapeString(title)}"
        column_type: ${columnType}
        ${defaults ? `defaults: ${JSON.stringify(JSON.stringify(defaults))}` : ''}
        ${description ? `description: "${escapeString(description)}"` : ''}
      ) {
        id
        title
        type
        description
      }
    }
  `,

  changeColumnTitle: (boardId: string, columnId: string, title: string) => `
    mutation {
      change_column_title(
        board_id: ${boardId}
        column_id: "${columnId}"
        title: "${escapeString(title)}"
      ) {
        id
        title
      }
    }
  `,

  changeColumnDescription: (boardId: string, columnId: string, description: string) => `
    mutation {
      change_column_description(
        board_id: ${boardId}
        column_id: "${columnId}"
        description: "${escapeString(description)}"
      ) {
        id
        description
      }
    }
  `,

  changeColumnMetadata: (boardId: string, columnId: string, columnProperty: string, value: string) => `
    mutation {
      change_column_metadata(
        board_id: ${boardId}
        column_id: "${columnId}"
        column_property: ${columnProperty}
        value: "${escapeString(value)}"
      ) {
        id
        title
        description
      }
    }
  `,

  deleteColumn: (boardId: string, columnId: string) => `
    mutation {
      delete_column(
        board_id: ${boardId}
        column_id: "${columnId}"
      ) {
        id
      }
    }
  `,
};

// Group Queries
export const groupQueries = {
  listGroups: (boardId: string) => `
    query {
      boards(ids: [${boardId}]) {
        groups {
          id
          title
          color
          position
          archived
          deleted
        }
      }
    }
  `,

  getGroup: (boardId: string, groupId: string) => `
    query {
      boards(ids: [${boardId}]) {
        groups(ids: ["${groupId}"]) {
          id
          title
          color
          position
          archived
          deleted
        }
      }
    }
  `,
};

// Group Mutations
export const groupMutations = {
  createGroup: (boardId: string, groupName: string, color?: string, position?: string, relativeTo?: string, positionRelativeMethod?: string) => `
    mutation {
      create_group(
        board_id: ${boardId}
        group_name: "${escapeString(groupName)}"
        ${color ? `group_color: "${color}"` : ''}
        ${position ? `position: "${position}"` : ''}
        ${relativeTo ? `relative_to: "${relativeTo}"` : ''}
        ${positionRelativeMethod ? `position_relative_method: ${positionRelativeMethod}` : ''}
      ) {
        id
        title
        color
        position
      }
    }
  `,

  duplicateGroup: (boardId: string, groupId: string, addToTop?: boolean, groupTitle?: string) => `
    mutation {
      duplicate_group(
        board_id: ${boardId}
        group_id: "${groupId}"
        ${addToTop !== undefined ? `add_to_top: ${addToTop}` : ''}
        ${groupTitle ? `group_title: "${escapeString(groupTitle)}"` : ''}
      ) {
        id
        title
        color
        position
      }
    }
  `,

  archiveGroup: (boardId: string, groupId: string) => `
    mutation {
      archive_group(
        board_id: ${boardId}
        group_id: "${groupId}"
      ) {
        id
        archived
      }
    }
  `,

  deleteGroup: (boardId: string, groupId: string) => `
    mutation {
      delete_group(
        board_id: ${boardId}
        group_id: "${groupId}"
      ) {
        id
        deleted
      }
    }
  `,

  moveGroupToBoard: (groupId: string, boardId: string) => `
    mutation {
      move_item_to_board(
        group_id: "${groupId}"
        board_id: ${boardId}
      ) {
        id
      }
    }
  `,

  updateGroup: (boardId: string, groupId: string, attribute: string, newValue: string) => `
    mutation {
      update_group(
        board_id: ${boardId}
        group_id: "${groupId}"
        group_attribute: ${attribute}
        new_value: "${escapeString(newValue)}"
      ) {
        id
        title
        color
        position
      }
    }
  `,
};

// Workspace Queries
export const workspaceQueries = {
  listWorkspaces: (limit: number, page?: number) => `
    query {
      workspaces(limit: ${limit}${page ? `, page: ${page}` : ''}) {
        id
        name
        kind
        description
        state
        created_at
        is_default_workspace
      }
    }
  `,

  getWorkspace: (workspaceId: string) => `
    query {
      workspaces(ids: [${workspaceId}]) {
        id
        name
        kind
        description
        state
        created_at
        is_default_workspace
        owners_subscribers {
          id
          name
          email
        }
        users_subscribers {
          id
          name
          email
        }
        teams_subscribers {
          id
          name
        }
      }
    }
  `,

  getWorkspaceBoards: (workspaceId: string, limit: number, page?: number) => `
    query {
      boards(workspace_ids: [${workspaceId}], limit: ${limit}${page ? `, page: ${page}` : ''}) {
        id
        name
        board_kind
        state
        description
      }
    }
  `,

  getWorkspaceUsers: (workspaceId: string) => `
    query {
      workspaces(ids: [${workspaceId}]) {
        users_subscribers {
          id
          name
          email
          is_admin
          is_guest
          enabled
        }
      }
    }
  `,
};

// Workspace Mutations
export const workspaceMutations = {
  createWorkspace: (name: string, kind: string, description?: string) => `
    mutation {
      create_workspace(
        name: "${escapeString(name)}"
        kind: ${kind}
        ${description ? `description: "${escapeString(description)}"` : ''}
      ) {
        id
        name
        kind
        description
      }
    }
  `,

  updateWorkspace: (workspaceId: string, name?: string, description?: string) => `
    mutation {
      update_workspace(
        id: ${workspaceId}
        attributes: {
          ${name ? `name: "${escapeString(name)}"` : ''}
          ${description ? `description: "${escapeString(description)}"` : ''}
        }
      ) {
        id
        name
        description
      }
    }
  `,

  deleteWorkspace: (workspaceId: string) => `
    mutation {
      delete_workspace(workspace_id: ${workspaceId}) {
        id
      }
    }
  `,

  addUsersToWorkspace: (workspaceId: string, userIds: string[], kind: string) => `
    mutation {
      add_users_to_workspace(
        workspace_id: ${workspaceId}
        user_ids: [${userIds.join(', ')}]
        kind: ${kind}
      ) {
        id
        name
        email
      }
    }
  `,

  removeUsersFromWorkspace: (workspaceId: string, userIds: string[]) => `
    mutation {
      delete_users_from_workspace(
        workspace_id: ${workspaceId}
        user_ids: [${userIds.join(', ')}]
      ) {
        id
        name
      }
    }
  `,

  addTeamsToWorkspace: (workspaceId: string, teamIds: string[]) => `
    mutation {
      add_teams_to_workspace(
        workspace_id: ${workspaceId}
        team_ids: [${teamIds.join(', ')}]
      ) {
        id
        name
      }
    }
  `,
};

// User Queries
export const userQueries = {
  listUsers: (limit: number, page?: number, kind?: string, newestFirst?: boolean) => `
    query {
      users(
        limit: ${limit}
        ${page ? `page: ${page}` : ''}
        ${kind ? `kind: ${kind}` : ''}
        ${newestFirst !== undefined ? `newest_first: ${newestFirst}` : ''}
      ) {
        id
        name
        email
        enabled
        is_admin
        is_guest
        is_pending
        is_view_only
        created_at
        title
        phone
        location
        time_zone_identifier
      }
    }
  `,

  getUser: (userId: string) => `
    query {
      users(ids: [${userId}]) {
        id
        name
        email
        enabled
        is_admin
        is_guest
        is_pending
        is_view_only
        created_at
        join_date
        last_activity
        title
        phone
        mobile_phone
        location
        time_zone_identifier
        birthday
        country_code
        current_language
        photo_original
        photo_small
        photo_thumb
        url
        utc_hours_diff
      }
    }
  `,

  getCurrentUser: () => `
    query {
      me {
        id
        name
        email
        enabled
        is_admin
        is_guest
        is_pending
        is_view_only
        created_at
        title
        phone
        location
        time_zone_identifier
        account {
          id
          name
          slug
        }
        teams {
          id
          name
        }
      }
    }
  `,

  getUserTeams: (userId: string) => `
    query {
      users(ids: [${userId}]) {
        teams {
          id
          name
          picture_url
        }
      }
    }
  `,

  getUserBoards: (userId: string) => `
    query {
      users(ids: [${userId}]) {
        id
        name
      }
      boards(limit: 100) {
        id
        name
        board_kind
        state
        subscribers {
          id
        }
      }
    }
  `,
};

// Team Queries
export const teamQueries = {
  listTeams: () => `
    query {
      teams {
        id
        name
        picture_url
        owners {
          id
          name
        }
        users {
          id
          name
          email
        }
      }
    }
  `,

  getTeam: (teamId: string) => `
    query {
      teams(ids: [${teamId}]) {
        id
        name
        picture_url
        owners {
          id
          name
          email
        }
        users {
          id
          name
          email
        }
      }
    }
  `,
};

// Team Mutations
export const teamMutations = {
  createTeam: (name: string, subscriberKind: string) => `
    mutation {
      create_team(
        name: "${escapeString(name)}"
        subscriber_kind: ${subscriberKind}
      ) {
        id
        name
      }
    }
  `,

  deleteTeam: (teamId: string) => `
    mutation {
      delete_team(team_id: ${teamId}) {
        id
      }
    }
  `,

  addUsersToTeam: (teamId: string, userIds: string[]) => `
    mutation {
      add_users_to_team(
        team_id: ${teamId}
        user_ids: [${userIds.join(', ')}]
      ) {
        successful_users {
          id
          name
        }
        failed_users {
          id
          name
        }
      }
    }
  `,

  removeUsersFromTeam: (teamId: string, userIds: string[]) => `
    mutation {
      remove_users_from_team(
        team_id: ${teamId}
        user_ids: [${userIds.join(', ')}]
      ) {
        successful_users {
          id
          name
        }
        failed_users {
          id
          name
        }
      }
    }
  `,
};

// Update Queries
export const updateQueries = {
  listUpdates: (limit: number, page?: number) => `
    query {
      updates(limit: ${limit}${page ? `, page: ${page}` : ''}) {
        id
        body
        text_body
        created_at
        updated_at
        creator_id
        item_id
        creator {
          id
          name
        }
      }
    }
  `,

  getUpdate: (updateId: string) => `
    query {
      updates(ids: [${updateId}]) {
        id
        body
        text_body
        created_at
        updated_at
        creator_id
        item_id
        creator {
          id
          name
          email
        }
        replies {
          id
          body
          text_body
          created_at
          creator {
            id
            name
          }
        }
      }
    }
  `,

  getReplies: (updateId: string) => `
    query {
      updates(ids: [${updateId}]) {
        replies {
          id
          body
          text_body
          created_at
          updated_at
          creator_id
          creator {
            id
            name
          }
        }
      }
    }
  `,
};

// Update Mutations
export const updateMutations = {
  createUpdate: (itemId: string, body: string, parentId?: string) => `
    mutation {
      create_update(
        item_id: ${itemId}
        body: "${escapeString(body)}"
        ${parentId ? `parent_id: ${parentId}` : ''}
      ) {
        id
        body
        text_body
        created_at
        creator_id
      }
    }
  `,

  editUpdate: (updateId: string, body: string) => `
    mutation {
      edit_update(
        id: ${updateId}
        body: "${escapeString(body)}"
      ) {
        id
        body
        text_body
        updated_at
      }
    }
  `,

  deleteUpdate: (updateId: string) => `
    mutation {
      delete_update(id: ${updateId}) {
        id
      }
    }
  `,

  likeUpdate: (updateId: string) => `
    mutation {
      like_update(update_id: ${updateId}) {
        id
      }
    }
  `,

  createReply: (updateId: string, body: string) => `
    mutation {
      create_update(
        item_id: null
        body: "${escapeString(body)}"
        parent_id: ${updateId}
      ) {
        id
        body
        text_body
        created_at
      }
    }
  `,
};

// Tag Queries
export const tagQueries = {
  listTags: () => `
    query {
      tags {
        id
        name
        color
      }
    }
  `,

  getTag: (tagId: string) => `
    query {
      tags(ids: [${tagId}]) {
        id
        name
        color
      }
    }
  `,
};

// Tag Mutations
export const tagMutations = {
  createTag: (tagName: string) => `
    mutation {
      create_or_get_tag(
        tag_name: "${escapeString(tagName)}"
      ) {
        id
        name
        color
      }
    }
  `,

  addTagToBoard: (boardId: string, tagName: string) => `
    mutation {
      create_or_get_tag(
        tag_name: "${escapeString(tagName)}"
        board_id: ${boardId}
      ) {
        id
        name
        color
      }
    }
  `,
};

// File/Asset Queries
export const fileQueries = {
  getAssets: (assetIds: string[]) => `
    query {
      assets(ids: [${assetIds.join(', ')}]) {
        id
        name
        created_at
        file_extension
        file_size
        original_geometry
        public_url
        url
        url_thumbnail
        uploaded_by {
          id
          name
        }
      }
    }
  `,
};

// Notification Mutations
export const notificationMutations = {
  createNotification: (userId: string, targetId: string, text: string, targetType: string) => `
    mutation {
      create_notification(
        user_id: ${userId}
        target_id: ${targetId}
        text: "${escapeString(text)}"
        target_type: ${targetType}
      ) {
        text
      }
    }
  `,
};

// Webhook Queries
export const webhookQueries = {
  listWebhooks: (boardId: string) => `
    query {
      webhooks(board_id: ${boardId}) {
        id
        board_id
        config
        event
      }
    }
  `,
};

// Webhook Mutations
export const webhookMutations = {
  createWebhook: (boardId: string, url: string, event: string, config?: IDataObject) => `
    mutation {
      create_webhook(
        board_id: ${boardId}
        url: "${url}"
        event: ${event}
        ${config ? `config: ${JSON.stringify(JSON.stringify(config))}` : ''}
      ) {
        id
        board_id
        event
      }
    }
  `,

  deleteWebhook: (webhookId: string) => `
    mutation {
      delete_webhook(id: ${webhookId}) {
        id
      }
    }
  `,
};

// App Queries
export const appQueries = {
  getInstalledApps: () => `
    query {
      apps_installs {
        app_id
        app_install_account_id
        app_install_user_id
        app_version {
          major
          minor
          patch
        }
        permissions
        timestamp
      }
    }
  `,

  getAppSubscription: (excludeFree?: boolean) => `
    query {
      app_subscription${excludeFree !== undefined ? `(exclude_free: ${excludeFree})` : ''} {
        billing_period
        days_left
        is_trial
        plan_id
        renewal_date
      }
    }
  `,

  getAppMonetizationStatus: () => `
    query {
      app_monetization_status {
        is_supported
      }
    }
  `,
};

// Account Queries
export const accountQueries = {
  getAccount: () => `
    query {
      account {
        id
        name
        logo
        country_code
        slug
        tier
        active_members_count
        show_timeline_weekends
        first_day_of_the_week
        sign_up_product_kind
      }
    }
  `,

  getAccountPlan: () => `
    query {
      account {
        plan {
          max_users
          period
          tier
          version
        }
        products {
          id
          kind
        }
      }
    }
  `,
};

// Doc Queries
export const docQueries = {
  listDocs: (limit: number, page?: number, workspaceId?: string) => `
    query {
      docs(
        limit: ${limit}
        ${page ? `page: ${page}` : ''}
        ${workspaceId ? `workspace_ids: [${workspaceId}]` : ''}
      ) {
        id
        name
        created_at
        doc_kind
        relative_url
        url
        workspace_id
        created_by {
          id
          name
        }
      }
    }
  `,

  getDoc: (docId: string) => `
    query {
      docs(ids: [${docId}]) {
        id
        name
        created_at
        doc_kind
        relative_url
        url
        workspace_id
        doc_folder_id
        object_id
        created_by {
          id
          name
          email
        }
        workspace {
          id
          name
        }
      }
    }
  `,

  getDocBlocks: (docId: string) => `
    query {
      docs(ids: [${docId}]) {
        blocks {
          id
          type
          content
          parent_block_id
          created_at
          updated_at
        }
      }
    }
  `,
};

// Doc Mutations
export const docMutations = {
  createDoc: (workspaceId: string, _name: string, _kind: string) => `
    mutation {
      create_doc(
        location: { workspace: { workspace_id: ${workspaceId} } }
      ) {
        id
        name
        url
      }
    }
  `,

  createDocBlock: (docId: string, type: string, content: string, parentBlockId?: string, afterBlockId?: string) => `
    mutation {
      create_doc_block(
        doc_id: ${docId}
        type: ${type}
        content: ${JSON.stringify(content)}
        ${parentBlockId ? `parent_block_id: "${parentBlockId}"` : ''}
        ${afterBlockId ? `after_block_id: "${afterBlockId}"` : ''}
      ) {
        id
        type
        content
      }
    }
  `,
};

// Folder Queries
export const folderQueries = {
  listFolders: (workspaceId: string, limit: number, page?: number) => `
    query {
      folders(
        workspace_ids: [${workspaceId}]
        limit: ${limit}
        ${page ? `page: ${page}` : ''}
      ) {
        id
        name
        color
        created_at
        owner_id
        parent_folder_id
        workspace_id
        children {
          id
          name
        }
      }
    }
  `,

  getFolder: (folderId: string) => `
    query {
      folders(ids: [${folderId}]) {
        id
        name
        color
        created_at
        owner_id
        parent_folder_id
        workspace_id
        children {
          id
          name
          color
        }
      }
    }
  `,
};

// Folder Mutations
export const folderMutations = {
  createFolder: (workspaceId: string, name: string, color?: string, parentFolderId?: string) => `
    mutation {
      create_folder(
        workspace_id: ${workspaceId}
        name: "${escapeString(name)}"
        ${color ? `color: ${color}` : ''}
        ${parentFolderId ? `parent_folder_id: ${parentFolderId}` : ''}
      ) {
        id
        name
        color
        workspace_id
      }
    }
  `,

  updateFolder: (folderId: string, name?: string, color?: string) => `
    mutation {
      update_folder(
        folder_id: ${folderId}
        ${name ? `name: "${escapeString(name)}"` : ''}
        ${color ? `color: ${color}` : ''}
      ) {
        id
        name
        color
      }
    }
  `,

  deleteFolder: (folderId: string) => `
    mutation {
      delete_folder(folder_id: ${folderId}) {
        id
      }
    }
  `,
};

// Helper Functions
function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

function formatColumnValues(values: IDataObject): string {
  return JSON.stringify(JSON.stringify(values));
}
