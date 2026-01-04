/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodePropertyOptions } from 'n8n-workflow';

export const MONDAY_COM_API_URL = 'https://api.monday.com/v2';
export const MONDAY_COM_FILE_UPLOAD_URL = 'https://api.monday.com/v2/file';

// Rate limits
export const COMPLEXITY_LIMIT_PER_MINUTE = 5000;
export const RATE_LIMIT_COMPLEXITY_POINTS = COMPLEXITY_LIMIT_PER_MINUTE;
export const CURSOR_VALIDITY_MINUTES = 60;

// Default pagination
export const DEFAULT_PAGE_LIMIT = 50;
export const DEFAULT_PAGE_SIZE = DEFAULT_PAGE_LIMIT;
export const MAX_PAGE_LIMIT = 500;
export const MAX_PAGE_SIZE = MAX_PAGE_LIMIT;

// Resources
export const RESOURCES: INodePropertyOptions[] = [
  { name: 'Account', value: 'account' },
  { name: 'App', value: 'app' },
  { name: 'Board', value: 'board' },
  { name: 'Column', value: 'column' },
  { name: 'Doc', value: 'doc' },
  { name: 'File', value: 'file' },
  { name: 'Folder', value: 'folder' },
  { name: 'Group', value: 'group' },
  { name: 'Item', value: 'item' },
  { name: 'Notification', value: 'notification' },
  { name: 'Tag', value: 'tag' },
  { name: 'Team', value: 'team' },
  { name: 'Update', value: 'update' },
  { name: 'User', value: 'user' },
  { name: 'Webhook', value: 'webhook' },
  { name: 'Workspace', value: 'workspace' },
];

// Board Operations
export const BOARD_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Add Subscriber', value: 'addBoardSubscriber' },
  { name: 'Archive', value: 'archiveBoard' },
  { name: 'Create', value: 'createBoard' },
  { name: 'Delete', value: 'deleteBoard' },
  { name: 'Duplicate', value: 'duplicateBoard' },
  { name: 'Get', value: 'getBoard' },
  { name: 'Get Activity', value: 'getBoardActivity' },
  { name: 'Get Columns', value: 'getBoardColumns' },
  { name: 'Get Groups', value: 'getBoardGroups' },
  { name: 'Get Items', value: 'getBoardItems' },
  { name: 'Get Views', value: 'getBoardViews' },
  { name: 'List', value: 'listBoards' },
  { name: 'Remove Subscriber', value: 'removeBoardSubscriber' },
  { name: 'Update Column', value: 'updateBoardColumn' },
];

// Item Operations
export const ITEM_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Archive', value: 'archiveItem' },
  { name: 'Change Column Value', value: 'changeItemColumnValue' },
  { name: 'Change Multiple Column Values', value: 'changeMultipleColumnValues' },
  { name: 'Clear Updates', value: 'clearItemUpdates' },
  { name: 'Create', value: 'createItem' },
  { name: 'Create Subitem', value: 'createSubitem' },
  { name: 'Delete', value: 'deleteItem' },
  { name: 'Duplicate', value: 'duplicateItem' },
  { name: 'Get', value: 'getItem' },
  { name: 'Get Column Values', value: 'getItemColumnValues' },
  { name: 'Get Linked Items', value: 'getLinkedItems' },
  { name: 'Get Subitems', value: 'getItemSubitems' },
  { name: 'Get Updates', value: 'getItemUpdates' },
  { name: 'List', value: 'listItems' },
  { name: 'Move to Board', value: 'moveItemToBoard' },
  { name: 'Move to Group', value: 'moveItemToGroup' },
];

// Column Operations
export const COLUMN_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Change Description', value: 'changeColumnDescription' },
  { name: 'Change Metadata', value: 'changeColumnMetadata' },
  { name: 'Change Title', value: 'changeColumnTitle' },
  { name: 'Create', value: 'createColumn' },
  { name: 'Delete', value: 'deleteColumn' },
  { name: 'Get', value: 'getColumn' },
  { name: 'List', value: 'listColumns' },
];

// Group Operations
export const GROUP_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Archive', value: 'archiveGroup' },
  { name: 'Create', value: 'createGroup' },
  { name: 'Delete', value: 'deleteGroup' },
  { name: 'Duplicate', value: 'duplicateGroup' },
  { name: 'Get', value: 'getGroup' },
  { name: 'List', value: 'listGroups' },
  { name: 'Move to Board', value: 'moveGroupToBoard' },
  { name: 'Update', value: 'updateGroup' },
];

// Workspace Operations
export const WORKSPACE_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Add Teams', value: 'addTeamsToWorkspace' },
  { name: 'Add Users', value: 'addUsersToWorkspace' },
  { name: 'Create', value: 'createWorkspace' },
  { name: 'Delete', value: 'deleteWorkspace' },
  { name: 'Get', value: 'getWorkspace' },
  { name: 'Get Boards', value: 'getWorkspaceBoards' },
  { name: 'Get Users', value: 'getWorkspaceUsers' },
  { name: 'List', value: 'listWorkspaces' },
  { name: 'Remove Users', value: 'removeUsersFromWorkspace' },
  { name: 'Update', value: 'updateWorkspace' },
];

// User Operations
export const USER_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Get', value: 'getUser' },
  { name: 'Get Boards', value: 'getUserBoards' },
  { name: 'Get Current User', value: 'getCurrentUser' },
  { name: 'Get Teams', value: 'getUserTeams' },
  { name: 'List', value: 'listUsers' },
];

// Team Operations
export const TEAM_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Add Users', value: 'addUsersToTeam' },
  { name: 'Create', value: 'createTeam' },
  { name: 'Delete', value: 'deleteTeam' },
  { name: 'Get', value: 'getTeam' },
  { name: 'List', value: 'listTeams' },
  { name: 'Remove Users', value: 'removeUsersFromTeam' },
];

// Update Operations
export const UPDATE_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Create', value: 'createUpdate' },
  { name: 'Create Reply', value: 'createReply' },
  { name: 'Delete', value: 'deleteUpdate' },
  { name: 'Edit', value: 'editUpdate' },
  { name: 'Get', value: 'getUpdate' },
  { name: 'Get Replies', value: 'getReplies' },
  { name: 'Like', value: 'likeUpdate' },
  { name: 'List', value: 'listUpdates' },
];

// Tag Operations
export const TAG_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Add to Board', value: 'addTagToBoard' },
  { name: 'Create', value: 'createTag' },
  { name: 'Get', value: 'getTag' },
  { name: 'List', value: 'listTags' },
  { name: 'Remove from Item', value: 'removeTagFromItem' },
];

// File Operations
export const FILE_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Add File to Column', value: 'addFileToColumn' },
  { name: 'Delete Asset', value: 'deleteAsset' },
  { name: 'Get Assets', value: 'getAssets' },
  { name: 'Upload to Column', value: 'uploadFileToColumn' },
  { name: 'Upload to Update', value: 'uploadFileToUpdate' },
];

// Notification Operations
export const NOTIFICATION_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Create', value: 'createNotification' },
];

// Webhook Operations
export const WEBHOOK_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Create', value: 'createWebhook' },
  { name: 'Delete', value: 'deleteWebhook' },
  { name: 'List', value: 'listWebhooks' },
];

// App Operations
export const APP_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Get Installed Apps', value: 'getInstalledApps' },
  { name: 'Get Monetization Status', value: 'getAppMonetizationStatus' },
  { name: 'Get Subscription', value: 'getAppSubscription' },
];

// Account Operations
export const ACCOUNT_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Get', value: 'getAccount' },
  { name: 'Get Plan', value: 'getAccountPlan' },
];

// Doc Operations
export const DOC_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Create', value: 'createDoc' },
  { name: 'Create Block', value: 'createDocBlock' },
  { name: 'Get', value: 'getDoc' },
  { name: 'Get Blocks', value: 'getDocBlocks' },
  { name: 'List', value: 'listDocs' },
];

// Folder Operations
export const FOLDER_OPERATIONS: INodePropertyOptions[] = [
  { name: 'Create', value: 'createFolder' },
  { name: 'Delete', value: 'deleteFolder' },
  { name: 'Get', value: 'getFolder' },
  { name: 'List', value: 'listFolders' },
  { name: 'Update', value: 'updateFolder' },
];

// Column Types
export const COLUMN_TYPES: INodePropertyOptions[] = [
  { name: 'Auto Number', value: 'auto_number' },
  { name: 'Board Relation', value: 'board_relation' },
  { name: 'Button', value: 'button' },
  { name: 'Checkbox', value: 'checkbox' },
  { name: 'Color Picker', value: 'color_picker' },
  { name: 'Country', value: 'country' },
  { name: 'Creation Log', value: 'creation_log' },
  { name: 'Date', value: 'date' },
  { name: 'Dependency', value: 'dependency' },
  { name: 'Doc', value: 'doc' },
  { name: 'Dropdown', value: 'dropdown' },
  { name: 'Email', value: 'email' },
  { name: 'File', value: 'file' },
  { name: 'Formula', value: 'formula' },
  { name: 'Hour', value: 'hour' },
  { name: 'Item Assignees', value: 'item_assignees' },
  { name: 'Item ID', value: 'item_id' },
  { name: 'Last Updated', value: 'last_updated' },
  { name: 'Link', value: 'link' },
  { name: 'Location', value: 'location' },
  { name: 'Long Text', value: 'long_text' },
  { name: 'Mirror', value: 'mirror' },
  { name: 'Name', value: 'name' },
  { name: 'Numbers', value: 'numbers' },
  { name: 'People', value: 'people' },
  { name: 'Phone', value: 'phone' },
  { name: 'Progress', value: 'progress' },
  { name: 'Rating', value: 'rating' },
  { name: 'Status', value: 'status' },
  { name: 'Subtasks', value: 'subtasks' },
  { name: 'Tags', value: 'tags' },
  { name: 'Team', value: 'team' },
  { name: 'Text', value: 'text' },
  { name: 'Timeline', value: 'timeline' },
  { name: 'Time Tracking', value: 'time_tracking' },
  { name: 'Vote', value: 'vote' },
  { name: 'Week', value: 'week' },
  { name: 'World Clock', value: 'world_clock' },
];

// Board Kinds
export const BOARD_KINDS: INodePropertyOptions[] = [
  { name: 'Public', value: 'public' },
  { name: 'Private', value: 'private' },
  { name: 'Share', value: 'share' },
];

// Board States
export const BOARD_STATES: INodePropertyOptions[] = [
  { name: 'Active', value: 'active' },
  { name: 'Archived', value: 'archived' },
  { name: 'Deleted', value: 'deleted' },
  { name: 'All', value: 'all' },
];

// Workspace Kinds
export const WORKSPACE_KINDS: INodePropertyOptions[] = [
  { name: 'Open', value: 'open' },
  { name: 'Closed', value: 'closed' },
];

// Webhook Event Types
export const WEBHOOK_EVENT_TYPES: INodePropertyOptions[] = [
  { name: 'Board Created', value: 'create_board' },
  { name: 'Board Deleted', value: 'delete_board' },
  { name: 'Column Created', value: 'create_column' },
  { name: 'Column Value Changed', value: 'change_column_value' },
  { name: 'Item Archived', value: 'item_archived' },
  { name: 'Item Created', value: 'create_item' },
  { name: 'Item Deleted', value: 'delete_item' },
  { name: 'Item Moved', value: 'move_item' },
  { name: 'Item Moved to Group', value: 'item_moved_to_any_group' },
  { name: 'Item Restored', value: 'item_restored' },
  { name: 'Name Changed', value: 'change_name' },
  { name: 'Specific Column Changed', value: 'change_specific_column_value' },
  { name: 'Status Column Changed', value: 'change_status_column_value' },
  { name: 'Subitem Archived', value: 'subitem_archived' },
  { name: 'Subitem Created', value: 'create_subitem' },
  { name: 'Subitem Deleted', value: 'subitem_deleted' },
  { name: 'Subitem Update Posted', value: 'create_subitem_update' },
  { name: 'Update Edited', value: 'edit_update' },
  { name: 'Update Posted', value: 'create_update' },
];

// Group Colors
export const GROUP_COLORS: INodePropertyOptions[] = [
  { name: 'Bright Green', value: '#00c875' },
  { name: 'Yellow', value: '#fdab3d' },
  { name: 'Red', value: '#e2445c' },
  { name: 'Blue', value: '#0086c0' },
  { name: 'Purple', value: '#a25ddc' },
  { name: 'Grey', value: '#c4c4c4' },
  { name: 'Dark Blue', value: '#225091' },
  { name: 'Orange', value: '#ff642e' },
  { name: 'Lime', value: '#9cd326' },
  { name: 'Teal', value: '#037f4c' },
  { name: 'Dark Purple', value: '#7f5347' },
  { name: 'Pink', value: '#ff5ac4' },
];
