/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IDataObject,
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodeExecutionData,
  INodePropertyOptions,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import {
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
} from './constants/constants';

import {
  mondayComApiRequest,
  getBoardOptions,
  getGroupOptions,
  getColumnOptions,
  getWorkspaceOptions,
  getUserOptions,
  getTeamOptions,
  mondayComFileUpload,
} from './transport/client';

import {
  boardQueries,
  boardMutations,
  itemQueries,
  itemMutations,
  columnQueries,
  columnMutations,
  groupQueries,
  groupMutations,
  workspaceQueries,
  workspaceMutations,
  userQueries,
  teamQueries,
  teamMutations,
  updateQueries,
  updateMutations,
  tagQueries,
  tagMutations,
  fileQueries,
  notificationMutations,
  webhookQueries,
  webhookMutations,
  appQueries,
  accountQueries,
  docQueries,
  docMutations,
  folderQueries,
  folderMutations,
} from './utils/queries';

// Column value utilities are available in ./utils/columnValues if needed

export class MondayCom implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Monday.com',
    name: 'mondayCom',
    icon: 'file:mondaycom.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description:
      'Interact with Monday.com boards, items, columns, groups, workspaces, users, teams, and more',
    defaults: {
      name: 'Monday.com',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'mondayComApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: RESOURCES,
        default: 'board',
      },

      // ==================== BOARD OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['board'],
          },
        },
        options: BOARD_OPERATIONS,
        default: 'listBoards',
      },

      // ==================== ITEM OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['item'],
          },
        },
        options: ITEM_OPERATIONS,
        default: 'listItems',
      },

      // ==================== COLUMN OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['column'],
          },
        },
        options: COLUMN_OPERATIONS,
        default: 'listColumns',
      },

      // ==================== GROUP OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['group'],
          },
        },
        options: GROUP_OPERATIONS,
        default: 'listGroups',
      },

      // ==================== WORKSPACE OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['workspace'],
          },
        },
        options: WORKSPACE_OPERATIONS,
        default: 'listWorkspaces',
      },

      // ==================== USER OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['user'],
          },
        },
        options: USER_OPERATIONS,
        default: 'listUsers',
      },

      // ==================== TEAM OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['team'],
          },
        },
        options: TEAM_OPERATIONS,
        default: 'listTeams',
      },

      // ==================== UPDATE OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['update'],
          },
        },
        options: UPDATE_OPERATIONS,
        default: 'listUpdates',
      },

      // ==================== TAG OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['tag'],
          },
        },
        options: TAG_OPERATIONS,
        default: 'listTags',
      },

      // ==================== FILE OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['file'],
          },
        },
        options: FILE_OPERATIONS,
        default: 'getAssets',
      },

      // ==================== NOTIFICATION OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['notification'],
          },
        },
        options: NOTIFICATION_OPERATIONS,
        default: 'createNotification',
      },

      // ==================== WEBHOOK OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['webhook'],
          },
        },
        options: WEBHOOK_OPERATIONS,
        default: 'listWebhooks',
      },

      // ==================== APP OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['app'],
          },
        },
        options: APP_OPERATIONS,
        default: 'getInstalledApps',
      },

      // ==================== ACCOUNT OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['account'],
          },
        },
        options: ACCOUNT_OPERATIONS,
        default: 'getAccount',
      },

      // ==================== DOC OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['doc'],
          },
        },
        options: DOC_OPERATIONS,
        default: 'listDocs',
      },

      // ==================== FOLDER OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['folder'],
          },
        },
        options: FOLDER_OPERATIONS,
        default: 'listFolders',
      },

      // ==================== COMMON PARAMETERS ====================

      // Board ID
      {
        displayName: 'Board',
        name: 'boardId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getBoards',
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['board'],
            operation: [
              'getBoard',
              'archiveBoard',
              'deleteBoard',
              'duplicateBoard',
              'getBoardColumns',
              'getBoardGroups',
              'getBoardItems',
              'getBoardViews',
              'getBoardActivity',
              'updateBoardColumn',
              'addBoardSubscriber',
              'removeBoardSubscriber',
            ],
          },
        },
        description: 'The board to operate on',
      },
      {
        displayName: 'Board',
        name: 'boardId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getBoards',
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['item'],
            operation: [
              'createItem',
              'duplicateItem',
              'changeItemColumnValue',
              'changeMultipleColumnValues',
              'moveItemToBoard',
            ],
          },
        },
        description: 'The board containing the item',
      },
      {
        displayName: 'Board',
        name: 'boardId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getBoards',
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['column'],
            operation: [
              'listColumns',
              'getColumn',
              'createColumn',
              'changeColumnTitle',
              'changeColumnDescription',
              'changeColumnMetadata',
              'deleteColumn',
            ],
          },
        },
        description: 'The board containing the columns',
      },
      {
        displayName: 'Board',
        name: 'boardId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getBoards',
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['group'],
            operation: [
              'listGroups',
              'getGroup',
              'createGroup',
              'duplicateGroup',
              'archiveGroup',
              'deleteGroup',
              'updateGroup',
            ],
          },
        },
        description: 'The board containing the groups',
      },
      {
        displayName: 'Board',
        name: 'boardId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getBoards',
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['webhook'],
            operation: ['createWebhook', 'listWebhooks'],
          },
        },
        description: 'The board to manage webhooks for',
      },

      // Item ID
      {
        displayName: 'Item ID',
        name: 'itemId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['item'],
            operation: [
              'getItem',
              'duplicateItem',
              'moveItemToGroup',
              'moveItemToBoard',
              'archiveItem',
              'deleteItem',
              'changeItemColumnValue',
              'changeMultipleColumnValues',
              'clearItemUpdates',
              'getItemColumnValues',
              'getItemSubitems',
              'getItemUpdates',
              'getLinkedItems',
              'createSubitem',
            ],
          },
        },
        description: 'The ID of the item',
      },
      {
        displayName: 'Item IDs',
        name: 'itemIds',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['item'],
            operation: ['listItems'],
          },
        },
        description: 'Comma-separated list of item IDs to retrieve',
      },

      // Group ID
      {
        displayName: 'Group',
        name: 'groupId',
        type: 'options',
        typeOptions: {
          loadOptionsDependsOn: ['boardId'],
          loadOptionsMethod: 'getGroups',
        },
        default: '',
        displayOptions: {
          show: {
            resource: ['item'],
            operation: ['createItem', 'moveItemToGroup', 'moveItemToBoard'],
          },
        },
        description: 'The group to add the item to',
      },
      {
        displayName: 'Group',
        name: 'groupId',
        type: 'options',
        typeOptions: {
          loadOptionsDependsOn: ['boardId'],
          loadOptionsMethod: 'getGroups',
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['group'],
            operation: ['getGroup', 'duplicateGroup', 'archiveGroup', 'deleteGroup', 'updateGroup'],
          },
        },
        description: 'The group to operate on',
      },

      // Column ID
      {
        displayName: 'Column',
        name: 'columnId',
        type: 'options',
        typeOptions: {
          loadOptionsDependsOn: ['boardId'],
          loadOptionsMethod: 'getColumns',
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['column'],
            operation: [
              'getColumn',
              'changeColumnTitle',
              'changeColumnDescription',
              'changeColumnMetadata',
              'deleteColumn',
            ],
          },
        },
        description: 'The column to operate on',
      },
      {
        displayName: 'Column',
        name: 'columnId',
        type: 'options',
        typeOptions: {
          loadOptionsDependsOn: ['boardId'],
          loadOptionsMethod: 'getColumns',
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['item'],
            operation: ['changeItemColumnValue'],
          },
        },
        description: 'The column to update',
      },

      // Workspace ID
      {
        displayName: 'Workspace',
        name: 'workspaceId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getWorkspaces',
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['workspace'],
            operation: [
              'getWorkspace',
              'updateWorkspace',
              'deleteWorkspace',
              'addUsersToWorkspace',
              'removeUsersFromWorkspace',
              'addTeamsToWorkspace',
              'getWorkspaceBoards',
              'getWorkspaceUsers',
            ],
          },
        },
        description: 'The workspace to operate on',
      },
      {
        displayName: 'Workspace',
        name: 'workspaceId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getWorkspaces',
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['folder'],
            operation: ['listFolders', 'createFolder'],
          },
        },
        description: 'The workspace containing the folders',
      },

      // User ID
      {
        displayName: 'User',
        name: 'userId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getUsers',
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['getUser', 'getUserTeams', 'getUserBoards'],
          },
        },
        description: 'The user to retrieve',
      },
      {
        displayName: 'User',
        name: 'userId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getUsers',
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['board'],
            operation: ['addBoardSubscriber', 'removeBoardSubscriber'],
          },
        },
        description: 'The user to add/remove',
      },
      {
        displayName: 'User',
        name: 'userId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getUsers',
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['notification'],
            operation: ['createNotification'],
          },
        },
        description: 'The user to notify',
      },
      {
        displayName: 'User IDs',
        name: 'userIds',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['workspace'],
            operation: ['addUsersToWorkspace', 'removeUsersFromWorkspace'],
          },
        },
        description: 'Comma-separated list of user IDs',
      },
      {
        displayName: 'User IDs',
        name: 'userIds',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['team'],
            operation: ['addUsersToTeam', 'removeUsersFromTeam'],
          },
        },
        description: 'Comma-separated list of user IDs',
      },

      // Team ID
      {
        displayName: 'Team',
        name: 'teamId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getTeams',
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['team'],
            operation: ['getTeam', 'deleteTeam', 'addUsersToTeam', 'removeUsersFromTeam'],
          },
        },
        description: 'The team to operate on',
      },
      {
        displayName: 'Team IDs',
        name: 'teamIds',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['workspace'],
            operation: ['addTeamsToWorkspace'],
          },
        },
        description: 'Comma-separated list of team IDs',
      },

      // Update ID
      {
        displayName: 'Update ID',
        name: 'updateId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['update'],
            operation: ['getUpdate', 'editUpdate', 'deleteUpdate', 'likeUpdate', 'getReplies', 'createReply'],
          },
        },
        description: 'The ID of the update',
      },

      // Tag ID
      {
        displayName: 'Tag ID',
        name: 'tagId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['tag'],
            operation: ['getTag'],
          },
        },
        description: 'The ID of the tag',
      },

      // Doc ID
      {
        displayName: 'Doc ID',
        name: 'docId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['doc'],
            operation: ['getDoc', 'getDocBlocks', 'createDocBlock'],
          },
        },
        description: 'The ID of the document',
      },

      // Folder ID
      {
        displayName: 'Folder ID',
        name: 'folderId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['folder'],
            operation: ['getFolder', 'updateFolder', 'deleteFolder'],
          },
        },
        description: 'The ID of the folder',
      },

      // Webhook ID
      {
        displayName: 'Webhook ID',
        name: 'webhookId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['webhook'],
            operation: ['deleteWebhook'],
          },
        },
        description: 'The ID of the webhook',
      },

      // Asset IDs
      {
        displayName: 'Asset IDs',
        name: 'assetIds',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['file'],
            operation: ['getAssets', 'deleteAsset'],
          },
        },
        description: 'Comma-separated list of asset IDs',
      },

      // ==================== CREATE/UPDATE PARAMETERS ====================

      // Board Name
      {
        displayName: 'Board Name',
        name: 'boardName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['board'],
            operation: ['createBoard'],
          },
        },
        description: 'The name of the new board',
      },

      // Board Kind
      {
        displayName: 'Board Kind',
        name: 'boardKind',
        type: 'options',
        options: BOARD_KINDS,
        default: 'public',
        required: true,
        displayOptions: {
          show: {
            resource: ['board'],
            operation: ['createBoard'],
          },
        },
        description: 'The kind of board to create',
      },

      // Item Name
      {
        displayName: 'Item Name',
        name: 'itemName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['item'],
            operation: ['createItem', 'createSubitem'],
          },
        },
        description: 'The name of the new item',
      },

      // Column Title
      {
        displayName: 'Column Title',
        name: 'columnTitle',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['column'],
            operation: ['createColumn', 'changeColumnTitle'],
          },
        },
        description: 'The title of the column',
      },

      // Column Type
      {
        displayName: 'Column Type',
        name: 'columnType',
        type: 'options',
        options: COLUMN_TYPES,
        default: 'text',
        required: true,
        displayOptions: {
          show: {
            resource: ['column'],
            operation: ['createColumn'],
          },
        },
        description: 'The type of column to create',
      },

      // Column Description
      {
        displayName: 'Column Description',
        name: 'columnDescription',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['column'],
            operation: ['createColumn', 'changeColumnDescription'],
          },
        },
        description: 'Description for the column',
      },

      // Column Value
      {
        displayName: 'Column Value',
        name: 'columnValue',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['item'],
            operation: ['changeItemColumnValue'],
          },
        },
        description: 'The value to set (JSON format)',
      },

      // Column Values (multiple)
      {
        displayName: 'Column Values',
        name: 'columnValues',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        displayOptions: {
          show: {
            resource: ['item'],
            operation: ['createItem', 'changeMultipleColumnValues', 'createSubitem'],
          },
        },
        options: [
          {
            displayName: 'Values',
            name: 'values',
            values: [
              {
                displayName: 'Column ID',
                name: 'columnId',
                type: 'string',
                default: '',
                description: 'The ID of the column',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
                description: 'The value to set (JSON or simple value)',
              },
            ],
          },
        ],
        description: 'Column values to set',
      },

      // Group Name
      {
        displayName: 'Group Name',
        name: 'groupName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['group'],
            operation: ['createGroup'],
          },
        },
        description: 'The name of the new group',
      },

      // Group Color
      {
        displayName: 'Group Color',
        name: 'groupColor',
        type: 'options',
        options: GROUP_COLORS,
        default: '#00c875',
        displayOptions: {
          show: {
            resource: ['group'],
            operation: ['createGroup'],
          },
        },
        description: 'The color of the group',
      },

      // Workspace Name
      {
        displayName: 'Workspace Name',
        name: 'workspaceName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['workspace'],
            operation: ['createWorkspace'],
          },
        },
        description: 'The name of the new workspace',
      },

      // Workspace Kind
      {
        displayName: 'Workspace Kind',
        name: 'workspaceKind',
        type: 'options',
        options: WORKSPACE_KINDS,
        default: 'open',
        required: true,
        displayOptions: {
          show: {
            resource: ['workspace'],
            operation: ['createWorkspace'],
          },
        },
        description: 'The kind of workspace to create',
      },

      // Workspace Description
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['workspace'],
            operation: ['createWorkspace', 'updateWorkspace'],
          },
        },
        description: 'Description of the workspace',
      },

      // Team Name
      {
        displayName: 'Team Name',
        name: 'teamName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['team'],
            operation: ['createTeam'],
          },
        },
        description: 'The name of the new team',
      },

      // Update Body
      {
        displayName: 'Body',
        name: 'body',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['update'],
            operation: ['createUpdate', 'editUpdate', 'createReply'],
          },
        },
        description: 'The body of the update/comment',
      },

      // Item ID for Update
      {
        displayName: 'Item ID',
        name: 'itemIdForUpdate',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['update'],
            operation: ['createUpdate'],
          },
        },
        description: 'The ID of the item to add the update to',
      },

      // Tag Name
      {
        displayName: 'Tag Name',
        name: 'tagName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['tag'],
            operation: ['createTag', 'addTagToBoard'],
          },
        },
        description: 'The name of the tag',
      },

      // Notification Text
      {
        displayName: 'Notification Text',
        name: 'notificationText',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['notification'],
            operation: ['createNotification'],
          },
        },
        description: 'The notification text',
      },

      // Target ID for Notification
      {
        displayName: 'Target ID',
        name: 'targetId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['notification'],
            operation: ['createNotification'],
          },
        },
        description: 'The ID of the target (item, project, etc.)',
      },

      // Target Type for Notification
      {
        displayName: 'Target Type',
        name: 'targetType',
        type: 'options',
        options: [
          { name: 'Project', value: 'Project' },
          { name: 'Post', value: 'Post' },
        ],
        default: 'Project',
        required: true,
        displayOptions: {
          show: {
            resource: ['notification'],
            operation: ['createNotification'],
          },
        },
        description: 'The type of target',
      },

      // Webhook URL
      {
        displayName: 'Webhook URL',
        name: 'webhookUrl',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['webhook'],
            operation: ['createWebhook'],
          },
        },
        description: 'The URL to receive webhook events',
      },

      // Webhook Event
      {
        displayName: 'Event',
        name: 'webhookEvent',
        type: 'options',
        options: WEBHOOK_EVENT_TYPES,
        default: 'create_item',
        required: true,
        displayOptions: {
          show: {
            resource: ['webhook'],
            operation: ['createWebhook'],
          },
        },
        description: 'The event to trigger the webhook',
      },

      // Doc Block Type
      {
        displayName: 'Block Type',
        name: 'blockType',
        type: 'options',
        options: [
          { name: 'Normal Text', value: 'normal_text' },
          { name: 'Large Title', value: 'large_title' },
          { name: 'Medium Title', value: 'medium_title' },
          { name: 'Small Title', value: 'small_title' },
          { name: 'Bulleted List', value: 'bulleted_list' },
          { name: 'Numbered List', value: 'numbered_list' },
          { name: 'Check List', value: 'check_list' },
          { name: 'Code', value: 'code' },
          { name: 'Quote', value: 'quote' },
          { name: 'Divider', value: 'divider' },
        ],
        default: 'normal_text',
        required: true,
        displayOptions: {
          show: {
            resource: ['doc'],
            operation: ['createDocBlock'],
          },
        },
        description: 'The type of block to create',
      },

      // Doc Block Content
      {
        displayName: 'Content',
        name: 'blockContent',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['doc'],
            operation: ['createDocBlock'],
          },
        },
        description: 'The content of the block',
      },

      // Folder Name
      {
        displayName: 'Folder Name',
        name: 'folderName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['folder'],
            operation: ['createFolder', 'updateFolder'],
          },
        },
        description: 'The name of the folder',
      },

      // Binary Property Name
      {
        displayName: 'Binary Property',
        name: 'binaryPropertyName',
        type: 'string',
        default: 'data',
        required: true,
        displayOptions: {
          show: {
            resource: ['file'],
            operation: ['uploadFileToColumn', 'uploadFileToUpdate'],
          },
        },
        description: 'The name of the binary property containing the file to upload',
      },

      // File Column ID
      {
        displayName: 'Column',
        name: 'fileColumnId',
        type: 'options',
        typeOptions: {
          loadOptionsDependsOn: ['boardId'],
          loadOptionsMethod: 'getColumns',
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['file'],
            operation: ['uploadFileToColumn', 'addFileToColumn'],
          },
        },
        description: 'The file column to upload to',
      },

      // File Item ID
      {
        displayName: 'Item ID',
        name: 'fileItemId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['file'],
            operation: ['uploadFileToColumn', 'addFileToColumn'],
          },
        },
        description: 'The ID of the item',
      },

      // File Board ID
      {
        displayName: 'Board',
        name: 'fileBoardId',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getBoards',
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['file'],
            operation: ['uploadFileToColumn', 'addFileToColumn'],
          },
        },
        description: 'The board containing the item',
      },

      // File Update ID
      {
        displayName: 'Update ID',
        name: 'fileUpdateId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['file'],
            operation: ['uploadFileToUpdate'],
          },
        },
        description: 'The ID of the update to add the file to',
      },

      // File URL
      {
        displayName: 'File URL',
        name: 'fileUrl',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['file'],
            operation: ['addFileToColumn'],
          },
        },
        description: 'The URL of the file to add',
      },

      // ==================== OPTIONS ====================

      // List Options
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            resource: ['board'],
            operation: ['listBoards'],
          },
        },
        options: [
          {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            typeOptions: {
              minValue: 1,
              maxValue: 500,
            },
            default: 50,
            description: 'Maximum number of boards to return',
          },
          {
            displayName: 'Page',
            name: 'page',
            type: 'number',
            typeOptions: {
              minValue: 1,
            },
            default: 1,
            description: 'Page number for pagination',
          },
          {
            displayName: 'State',
            name: 'state',
            type: 'options',
            options: BOARD_STATES,
            default: 'active',
            description: 'Filter boards by state',
          },
        ],
      },

      // Board Items Options
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            resource: ['board'],
            operation: ['getBoardItems'],
          },
        },
        options: [
          {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            typeOptions: {
              minValue: 1,
              maxValue: 500,
            },
            default: 50,
            description: 'Maximum number of items to return',
          },
          {
            displayName: 'Cursor',
            name: 'cursor',
            type: 'string',
            default: '',
            description: 'Pagination cursor for subsequent requests',
          },
        ],
      },

      // Duplicate Board Options
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            resource: ['board'],
            operation: ['duplicateBoard'],
          },
        },
        options: [
          {
            displayName: 'Board Name',
            name: 'boardName',
            type: 'string',
            default: '',
            description: 'Name for the duplicated board',
          },
          {
            displayName: 'Duplicate Type',
            name: 'duplicateType',
            type: 'options',
            options: [
              { name: 'Duplicate Board with Structure', value: 'duplicate_board_with_structure' },
              { name: 'Duplicate Board with Pulses', value: 'duplicate_board_with_pulses' },
              {
                name: 'Duplicate Board with Pulses and Updates',
                value: 'duplicate_board_with_pulses_and_updates',
              },
            ],
            default: 'duplicate_board_with_structure',
            description: 'Type of duplication',
          },
          {
            displayName: 'Workspace',
            name: 'workspaceId',
            type: 'options',
            typeOptions: {
              loadOptionsMethod: 'getWorkspaces',
            },
            default: '',
            description: 'Workspace for the duplicated board',
          },
        ],
      },

      // Item Create Options
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            resource: ['item'],
            operation: ['createItem', 'createSubitem'],
          },
        },
        options: [
          {
            displayName: 'Create Labels If Missing',
            name: 'createLabels',
            type: 'boolean',
            default: false,
            description: 'Whether to create status/dropdown labels if they don\'t exist',
          },
        ],
      },

      // User List Options
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['listUsers'],
          },
        },
        options: [
          {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            typeOptions: {
              minValue: 1,
              maxValue: 1000,
            },
            default: 50,
            description: 'Maximum number of users to return',
          },
          {
            displayName: 'Page',
            name: 'page',
            type: 'number',
            typeOptions: {
              minValue: 1,
            },
            default: 1,
            description: 'Page number for pagination',
          },
          {
            displayName: 'Kind',
            name: 'kind',
            type: 'options',
            options: [
              { name: 'All', value: 'all' },
              { name: 'Non-Guests', value: 'non_guests' },
              { name: 'Guests', value: 'guests' },
              { name: 'Non-Pending', value: 'non_pending' },
            ],
            default: 'all',
            description: 'Filter users by kind',
          },
          {
            displayName: 'Newest First',
            name: 'newestFirst',
            type: 'boolean',
            default: false,
            description: 'Whether to sort by newest first',
          },
        ],
      },

      // Update List Options
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            resource: ['update'],
            operation: ['listUpdates'],
          },
        },
        options: [
          {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            typeOptions: {
              minValue: 1,
              maxValue: 100,
            },
            default: 25,
            description: 'Maximum number of updates to return',
          },
          {
            displayName: 'Page',
            name: 'page',
            type: 'number',
            typeOptions: {
              minValue: 1,
            },
            default: 1,
            description: 'Page number for pagination',
          },
        ],
      },

      // Workspace List Options
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            resource: ['workspace'],
            operation: ['listWorkspaces'],
          },
        },
        options: [
          {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            typeOptions: {
              minValue: 1,
              maxValue: 100,
            },
            default: 25,
            description: 'Maximum number of workspaces to return',
          },
          {
            displayName: 'Page',
            name: 'page',
            type: 'number',
            typeOptions: {
              minValue: 1,
            },
            default: 1,
            description: 'Page number for pagination',
          },
        ],
      },

      // Doc List Options
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            resource: ['doc'],
            operation: ['listDocs'],
          },
        },
        options: [
          {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            typeOptions: {
              minValue: 1,
              maxValue: 100,
            },
            default: 25,
            description: 'Maximum number of documents to return',
          },
          {
            displayName: 'Page',
            name: 'page',
            type: 'number',
            typeOptions: {
              minValue: 1,
            },
            default: 1,
            description: 'Page number for pagination',
          },
          {
            displayName: 'Workspace',
            name: 'workspaceId',
            type: 'options',
            typeOptions: {
              loadOptionsMethod: 'getWorkspaces',
            },
            default: '',
            description: 'Filter by workspace',
          },
        ],
      },

      // Group Update Attribute
      {
        displayName: 'Attribute',
        name: 'groupAttribute',
        type: 'options',
        options: [
          { name: 'Title', value: 'title' },
          { name: 'Color', value: 'color' },
          { name: 'Position', value: 'relative_position_after' },
        ],
        default: 'title',
        required: true,
        displayOptions: {
          show: {
            resource: ['group'],
            operation: ['updateGroup'],
          },
        },
        description: 'The attribute to update',
      },

      // Group Update Value
      {
        displayName: 'New Value',
        name: 'groupNewValue',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['group'],
            operation: ['updateGroup'],
          },
        },
        description: 'The new value for the attribute',
      },
    ],
  };

  methods = {
    loadOptions: {
      async getBoards(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        return getBoardOptions.call(this);
      },

      async getGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const boardId = this.getCurrentNodeParameter('boardId') as string;
        if (!boardId) {
          return [];
        }
        return getGroupOptions.call(this, boardId);
      },

      async getColumns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const boardId =
          (this.getCurrentNodeParameter('boardId') as string) ||
          (this.getCurrentNodeParameter('fileBoardId') as string);
        if (!boardId) {
          return [];
        }
        return getColumnOptions.call(this, boardId);
      },

      async getWorkspaces(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        return getWorkspaceOptions.call(this);
      },

      async getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        return getUserOptions.call(this);
      },

      async getTeams(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        return getTeamOptions.call(this);
      },
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: IDataObject | IDataObject[] = {};

        // ==================== BOARD OPERATIONS ====================
        if (resource === 'board') {
          if (operation === 'listBoards') {
            const options = this.getNodeParameter('options', i) as IDataObject;
            const limit = (options.limit as number) || 50;
            const page = options.page as number | undefined;
            const query = boardQueries.listBoards(limit, page);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.boards as IDataObject[]) || [];
          } else if (operation === 'getBoard') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const query = boardQueries.getBoard(boardId);
            const response = await mondayComApiRequest.call(this, query);
            const boards = response.boards as IDataObject[];
            responseData = boards?.[0] || {};
          } else if (operation === 'createBoard') {
            const boardName = this.getNodeParameter('boardName', i) as string;
            const boardKind = this.getNodeParameter('boardKind', i) as string;
            const query = boardMutations.createBoard(boardName, boardKind);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.create_board as IDataObject) || {};
          } else if (operation === 'duplicateBoard') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const options = this.getNodeParameter('options', i) as IDataObject;
            const duplicateType =
              (options.duplicateType as string) || 'duplicate_board_with_structure';
            const boardName = options.boardName as string | undefined;
            const workspaceId = options.workspaceId as string | undefined;
            const query = boardMutations.duplicateBoard(
              boardId,
              duplicateType,
              boardName,
              workspaceId,
            );
            const response = await mondayComApiRequest.call(this, query);
            responseData = ((response.duplicate_board as IDataObject)?.board || {}) as IDataObject;
          } else if (operation === 'archiveBoard') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const query = boardMutations.archiveBoard(boardId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.archive_board as IDataObject) || {};
          } else if (operation === 'deleteBoard') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const query = boardMutations.deleteBoard(boardId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.delete_board as IDataObject) || {};
          } else if (operation === 'getBoardColumns') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const query = boardQueries.getBoardColumns(boardId);
            const response = await mondayComApiRequest.call(this, query);
            const boards = response.boards as IDataObject[];
            responseData = (boards?.[0]?.columns as IDataObject[]) || [];
          } else if (operation === 'getBoardGroups') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const query = boardQueries.getBoardGroups(boardId);
            const response = await mondayComApiRequest.call(this, query);
            const boards = response.boards as IDataObject[];
            responseData = (boards?.[0]?.groups as IDataObject[]) || [];
          } else if (operation === 'getBoardItems') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const options = this.getNodeParameter('options', i) as IDataObject;
            const limit = (options.limit as number) || 50;
            const cursor = options.cursor as string | undefined;
            const query = boardQueries.getBoardItems(boardId, limit, cursor);
            const response = await mondayComApiRequest.call(this, query);
            const boards = response.boards as IDataObject[];
            const itemsPage = boards?.[0]?.items_page as IDataObject;
            responseData = {
              items: itemsPage?.items || [],
              cursor: itemsPage?.cursor || null,
            };
          } else if (operation === 'getBoardViews') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const query = boardQueries.getBoardViews(boardId);
            const response = await mondayComApiRequest.call(this, query);
            const boards = response.boards as IDataObject[];
            responseData = (boards?.[0]?.views as IDataObject[]) || [];
          } else if (operation === 'getBoardActivity') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const query = boardQueries.getBoardActivity(boardId, 50);
            const response = await mondayComApiRequest.call(this, query);
            const boards = response.boards as IDataObject[];
            responseData = (boards?.[0]?.activity_logs as IDataObject[]) || [];
          } else if (operation === 'addBoardSubscriber') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const userId = this.getNodeParameter('userId', i) as string;
            const query = boardMutations.addBoardSubscriber(boardId, userId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.add_subscribers_to_board as IDataObject[]) || [];
          } else if (operation === 'removeBoardSubscriber') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const userId = this.getNodeParameter('userId', i) as string;
            const query = boardMutations.removeBoardSubscriber(boardId, userId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.delete_subscribers_from_board as IDataObject[]) || [];
          }
        }

        // ==================== ITEM OPERATIONS ====================
        else if (resource === 'item') {
          if (operation === 'listItems') {
            const itemIdsStr = this.getNodeParameter('itemIds', i) as string;
            const itemIds = itemIdsStr.split(',').map((id) => id.trim());
            const query = itemQueries.listItems(itemIds);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.items as IDataObject[]) || [];
          } else if (operation === 'getItem') {
            const itemId = this.getNodeParameter('itemId', i) as string;
            const query = itemQueries.getItem(itemId);
            const response = await mondayComApiRequest.call(this, query);
            const items = response.items as IDataObject[];
            responseData = items?.[0] || {};
          } else if (operation === 'createItem') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const itemName = this.getNodeParameter('itemName', i) as string;
            const groupId = this.getNodeParameter('groupId', i) as string | undefined;
            const columnValuesInput = this.getNodeParameter('columnValues', i) as IDataObject;
            const options = this.getNodeParameter('options', i) as IDataObject;

            let columnValues: IDataObject | undefined;
            if (columnValuesInput.values && Array.isArray(columnValuesInput.values)) {
              columnValues = {};
              for (const col of columnValuesInput.values as IDataObject[]) {
                if (col.columnId && col.value !== undefined) {
                  try {
                    columnValues[col.columnId as string] = JSON.parse(col.value as string);
                  } catch {
                    columnValues[col.columnId as string] = col.value;
                  }
                }
              }
            }

            const query = itemMutations.createItem(
              boardId,
              itemName,
              groupId,
              columnValues,
              options.createLabels as boolean | undefined,
            );
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.create_item as IDataObject) || {};
          } else if (operation === 'duplicateItem') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const itemId = this.getNodeParameter('itemId', i) as string;
            const query = itemMutations.duplicateItem(boardId, itemId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.duplicate_item as IDataObject) || {};
          } else if (operation === 'moveItemToGroup') {
            const itemId = this.getNodeParameter('itemId', i) as string;
            const groupId = this.getNodeParameter('groupId', i) as string;
            const query = itemMutations.moveItemToGroup(itemId, groupId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.move_item_to_group as IDataObject) || {};
          } else if (operation === 'moveItemToBoard') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const itemId = this.getNodeParameter('itemId', i) as string;
            const groupId = this.getNodeParameter('groupId', i) as string;
            const query = itemMutations.moveItemToBoard(boardId, itemId, groupId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.move_item_to_board as IDataObject) || {};
          } else if (operation === 'archiveItem') {
            const itemId = this.getNodeParameter('itemId', i) as string;
            const query = itemMutations.archiveItem(itemId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.archive_item as IDataObject) || {};
          } else if (operation === 'deleteItem') {
            const itemId = this.getNodeParameter('itemId', i) as string;
            const query = itemMutations.deleteItem(itemId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.delete_item as IDataObject) || {};
          } else if (operation === 'changeItemColumnValue') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const itemId = this.getNodeParameter('itemId', i) as string;
            const columnId = this.getNodeParameter('columnId', i) as string;
            const columnValue = this.getNodeParameter('columnValue', i) as string;
            const query = itemMutations.changeItemColumnValue(boardId, itemId, columnId, columnValue);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.change_column_value as IDataObject) || {};
          } else if (operation === 'changeMultipleColumnValues') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const itemId = this.getNodeParameter('itemId', i) as string;
            const columnValuesInput = this.getNodeParameter('columnValues', i) as IDataObject;
            const options = this.getNodeParameter('options', i) as IDataObject;

            let columnValues: IDataObject = {};
            if (columnValuesInput.values && Array.isArray(columnValuesInput.values)) {
              for (const col of columnValuesInput.values as IDataObject[]) {
                if (col.columnId && col.value !== undefined) {
                  try {
                    columnValues[col.columnId as string] = JSON.parse(col.value as string);
                  } catch {
                    columnValues[col.columnId as string] = col.value;
                  }
                }
              }
            }

            const query = itemMutations.changeMultipleColumnValues(
              boardId,
              itemId,
              columnValues,
              options.createLabels as boolean | undefined,
            );
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.change_multiple_column_values as IDataObject) || {};
          } else if (operation === 'clearItemUpdates') {
            const itemId = this.getNodeParameter('itemId', i) as string;
            const query = itemMutations.clearItemUpdates(itemId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.clear_item_updates as IDataObject) || {};
          } else if (operation === 'getItemColumnValues') {
            const itemId = this.getNodeParameter('itemId', i) as string;
            const query = itemQueries.getItemColumnValues(itemId);
            const response = await mondayComApiRequest.call(this, query);
            const items = response.items as IDataObject[];
            responseData = (items?.[0]?.column_values as IDataObject[]) || [];
          } else if (operation === 'getItemSubitems') {
            const itemId = this.getNodeParameter('itemId', i) as string;
            const query = itemQueries.getItemSubitems(itemId);
            const response = await mondayComApiRequest.call(this, query);
            const items = response.items as IDataObject[];
            responseData = (items?.[0]?.subitems as IDataObject[]) || [];
          } else if (operation === 'getItemUpdates') {
            const itemId = this.getNodeParameter('itemId', i) as string;
            const query = itemQueries.getItemUpdates(itemId, 25);
            const response = await mondayComApiRequest.call(this, query);
            const items = response.items as IDataObject[];
            responseData = (items?.[0]?.updates as IDataObject[]) || [];
          } else if (operation === 'getLinkedItems') {
            const itemId = this.getNodeParameter('itemId', i) as string;
            const query = itemQueries.getLinkedItems(itemId, '');
            const response = await mondayComApiRequest.call(this, query);
            const items = response.items as IDataObject[];
            responseData = (items?.[0]?.linked_items as IDataObject[]) || [];
          } else if (operation === 'createSubitem') {
            const parentItemId = this.getNodeParameter('itemId', i) as string;
            const itemName = this.getNodeParameter('itemName', i) as string;
            const columnValuesInput = this.getNodeParameter('columnValues', i) as IDataObject;
            const options = this.getNodeParameter('options', i) as IDataObject;

            let columnValues: IDataObject | undefined;
            if (columnValuesInput.values && Array.isArray(columnValuesInput.values)) {
              columnValues = {};
              for (const col of columnValuesInput.values as IDataObject[]) {
                if (col.columnId && col.value !== undefined) {
                  try {
                    columnValues[col.columnId as string] = JSON.parse(col.value as string);
                  } catch {
                    columnValues[col.columnId as string] = col.value;
                  }
                }
              }
            }

            const query = itemMutations.createSubitem(
              parentItemId,
              itemName,
              columnValues,
              options.createLabels as boolean | undefined,
            );
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.create_subitem as IDataObject) || {};
          }
        }

        // ==================== COLUMN OPERATIONS ====================
        else if (resource === 'column') {
          if (operation === 'listColumns') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const query = columnQueries.listColumns(boardId);
            const response = await mondayComApiRequest.call(this, query);
            const boards = response.boards as IDataObject[];
            responseData = (boards?.[0]?.columns as IDataObject[]) || [];
          } else if (operation === 'getColumn') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const columnId = this.getNodeParameter('columnId', i) as string;
            const query = columnQueries.getColumn(boardId, columnId);
            const response = await mondayComApiRequest.call(this, query);
            const boards = response.boards as IDataObject[];
            const columns = boards?.[0]?.columns as IDataObject[];
            responseData = columns?.[0] || {};
          } else if (operation === 'createColumn') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const title = this.getNodeParameter('columnTitle', i) as string;
            const columnType = this.getNodeParameter('columnType', i) as string;
            const description = this.getNodeParameter('columnDescription', i) as string | undefined;
            const query = columnMutations.createColumn(boardId, title, columnType, undefined, description);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.create_column as IDataObject) || {};
          } else if (operation === 'changeColumnTitle') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const columnId = this.getNodeParameter('columnId', i) as string;
            const title = this.getNodeParameter('columnTitle', i) as string;
            const query = columnMutations.changeColumnTitle(boardId, columnId, title);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.change_column_title as IDataObject) || {};
          } else if (operation === 'changeColumnDescription') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const columnId = this.getNodeParameter('columnId', i) as string;
            const description = this.getNodeParameter('columnDescription', i) as string;
            const query = columnMutations.changeColumnDescription(boardId, columnId, description);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.change_column_description as IDataObject) || {};
          } else if (operation === 'deleteColumn') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const columnId = this.getNodeParameter('columnId', i) as string;
            const query = columnMutations.deleteColumn(boardId, columnId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.delete_column as IDataObject) || {};
          }
        }

        // ==================== GROUP OPERATIONS ====================
        else if (resource === 'group') {
          if (operation === 'listGroups') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const query = groupQueries.listGroups(boardId);
            const response = await mondayComApiRequest.call(this, query);
            const boards = response.boards as IDataObject[];
            responseData = (boards?.[0]?.groups as IDataObject[]) || [];
          } else if (operation === 'getGroup') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const groupId = this.getNodeParameter('groupId', i) as string;
            const query = groupQueries.getGroup(boardId, groupId);
            const response = await mondayComApiRequest.call(this, query);
            const boards = response.boards as IDataObject[];
            const groups = boards?.[0]?.groups as IDataObject[];
            responseData = groups?.[0] || {};
          } else if (operation === 'createGroup') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const groupName = this.getNodeParameter('groupName', i) as string;
            const groupColor = this.getNodeParameter('groupColor', i) as string | undefined;
            const query = groupMutations.createGroup(boardId, groupName, groupColor);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.create_group as IDataObject) || {};
          } else if (operation === 'duplicateGroup') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const groupId = this.getNodeParameter('groupId', i) as string;
            const query = groupMutations.duplicateGroup(boardId, groupId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.duplicate_group as IDataObject) || {};
          } else if (operation === 'archiveGroup') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const groupId = this.getNodeParameter('groupId', i) as string;
            const query = groupMutations.archiveGroup(boardId, groupId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.archive_group as IDataObject) || {};
          } else if (operation === 'deleteGroup') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const groupId = this.getNodeParameter('groupId', i) as string;
            const query = groupMutations.deleteGroup(boardId, groupId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.delete_group as IDataObject) || {};
          } else if (operation === 'updateGroup') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const groupId = this.getNodeParameter('groupId', i) as string;
            const attribute = this.getNodeParameter('groupAttribute', i) as string;
            const newValue = this.getNodeParameter('groupNewValue', i) as string;
            const query = groupMutations.updateGroup(boardId, groupId, attribute, newValue);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.update_group as IDataObject) || {};
          }
        }

        // ==================== WORKSPACE OPERATIONS ====================
        else if (resource === 'workspace') {
          if (operation === 'listWorkspaces') {
            const options = this.getNodeParameter('options', i) as IDataObject;
            const limit = (options.limit as number) || 25;
            const page = options.page as number | undefined;
            const query = workspaceQueries.listWorkspaces(limit, page);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.workspaces as IDataObject[]) || [];
          } else if (operation === 'getWorkspace') {
            const workspaceId = this.getNodeParameter('workspaceId', i) as string;
            const query = workspaceQueries.getWorkspace(workspaceId);
            const response = await mondayComApiRequest.call(this, query);
            const workspaces = response.workspaces as IDataObject[];
            responseData = workspaces?.[0] || {};
          } else if (operation === 'createWorkspace') {
            const name = this.getNodeParameter('workspaceName', i) as string;
            const kind = this.getNodeParameter('workspaceKind', i) as string;
            const description = this.getNodeParameter('description', i) as string | undefined;
            const query = workspaceMutations.createWorkspace(name, kind, description);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.create_workspace as IDataObject) || {};
          } else if (operation === 'updateWorkspace') {
            const workspaceId = this.getNodeParameter('workspaceId', i) as string;
            const name = this.getNodeParameter('workspaceName', i) as string | undefined;
            const description = this.getNodeParameter('description', i) as string | undefined;
            const query = workspaceMutations.updateWorkspace(workspaceId, name, description);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.update_workspace as IDataObject) || {};
          } else if (operation === 'deleteWorkspace') {
            const workspaceId = this.getNodeParameter('workspaceId', i) as string;
            const query = workspaceMutations.deleteWorkspace(workspaceId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.delete_workspace as IDataObject) || {};
          } else if (operation === 'addUsersToWorkspace') {
            const workspaceId = this.getNodeParameter('workspaceId', i) as string;
            const userIdsStr = this.getNodeParameter('userIds', i) as string;
            const userIds = userIdsStr.split(',').map((id) => id.trim());
            const query = workspaceMutations.addUsersToWorkspace(workspaceId, userIds, 'subscriber');
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.add_users_to_workspace as IDataObject[]) || [];
          } else if (operation === 'removeUsersFromWorkspace') {
            const workspaceId = this.getNodeParameter('workspaceId', i) as string;
            const userIdsStr = this.getNodeParameter('userIds', i) as string;
            const userIds = userIdsStr.split(',').map((id) => id.trim());
            const query = workspaceMutations.removeUsersFromWorkspace(workspaceId, userIds);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.delete_users_from_workspace as IDataObject[]) || [];
          } else if (operation === 'addTeamsToWorkspace') {
            const workspaceId = this.getNodeParameter('workspaceId', i) as string;
            const teamIdsStr = this.getNodeParameter('teamIds', i) as string;
            const teamIds = teamIdsStr.split(',').map((id) => id.trim());
            const query = workspaceMutations.addTeamsToWorkspace(workspaceId, teamIds);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.add_teams_to_workspace as IDataObject[]) || [];
          } else if (operation === 'getWorkspaceBoards') {
            const workspaceId = this.getNodeParameter('workspaceId', i) as string;
            const query = workspaceQueries.getWorkspaceBoards(workspaceId, 100);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.boards as IDataObject[]) || [];
          } else if (operation === 'getWorkspaceUsers') {
            const workspaceId = this.getNodeParameter('workspaceId', i) as string;
            const query = workspaceQueries.getWorkspaceUsers(workspaceId);
            const response = await mondayComApiRequest.call(this, query);
            const workspaces = response.workspaces as IDataObject[];
            responseData = (workspaces?.[0]?.users_subscribers as IDataObject[]) || [];
          }
        }

        // ==================== USER OPERATIONS ====================
        else if (resource === 'user') {
          if (operation === 'listUsers') {
            const options = this.getNodeParameter('options', i) as IDataObject;
            const limit = (options.limit as number) || 50;
            const page = options.page as number | undefined;
            const kind = options.kind as string | undefined;
            const newestFirst = options.newestFirst as boolean | undefined;
            const query = userQueries.listUsers(limit, page, kind, newestFirst);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.users as IDataObject[]) || [];
          } else if (operation === 'getUser') {
            const userId = this.getNodeParameter('userId', i) as string;
            const query = userQueries.getUser(userId);
            const response = await mondayComApiRequest.call(this, query);
            const users = response.users as IDataObject[];
            responseData = users?.[0] || {};
          } else if (operation === 'getCurrentUser') {
            const query = userQueries.getCurrentUser();
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.me as IDataObject) || {};
          } else if (operation === 'getUserTeams') {
            const userId = this.getNodeParameter('userId', i) as string;
            const query = userQueries.getUserTeams(userId);
            const response = await mondayComApiRequest.call(this, query);
            const users = response.users as IDataObject[];
            responseData = (users?.[0]?.teams as IDataObject[]) || [];
          } else if (operation === 'getUserBoards') {
            const userId = this.getNodeParameter('userId', i) as string;
            const query = userQueries.getUserBoards(userId);
            const response = await mondayComApiRequest.call(this, query);
            const boards = response.boards as IDataObject[];
            // Filter boards where user is a subscriber
            responseData = boards?.filter((board) => {
              const subscribers = board.subscribers as IDataObject[];
              return subscribers?.some((s) => s.id === userId);
            }) || [];
          }
        }

        // ==================== TEAM OPERATIONS ====================
        else if (resource === 'team') {
          if (operation === 'listTeams') {
            const query = teamQueries.listTeams();
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.teams as IDataObject[]) || [];
          } else if (operation === 'getTeam') {
            const teamId = this.getNodeParameter('teamId', i) as string;
            const query = teamQueries.getTeam(teamId);
            const response = await mondayComApiRequest.call(this, query);
            const teams = response.teams as IDataObject[];
            responseData = teams?.[0] || {};
          } else if (operation === 'createTeam') {
            const teamName = this.getNodeParameter('teamName', i) as string;
            const query = teamMutations.createTeam(teamName, 'team_owners_and_subscribers');
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.create_team as IDataObject) || {};
          } else if (operation === 'deleteTeam') {
            const teamId = this.getNodeParameter('teamId', i) as string;
            const query = teamMutations.deleteTeam(teamId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.delete_team as IDataObject) || {};
          } else if (operation === 'addUsersToTeam') {
            const teamId = this.getNodeParameter('teamId', i) as string;
            const userIdsStr = this.getNodeParameter('userIds', i) as string;
            const userIds = userIdsStr.split(',').map((id) => id.trim());
            const query = teamMutations.addUsersToTeam(teamId, userIds);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.add_users_to_team as IDataObject) || {};
          } else if (operation === 'removeUsersFromTeam') {
            const teamId = this.getNodeParameter('teamId', i) as string;
            const userIdsStr = this.getNodeParameter('userIds', i) as string;
            const userIds = userIdsStr.split(',').map((id) => id.trim());
            const query = teamMutations.removeUsersFromTeam(teamId, userIds);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.remove_users_from_team as IDataObject) || {};
          }
        }

        // ==================== UPDATE OPERATIONS ====================
        else if (resource === 'update') {
          if (operation === 'listUpdates') {
            const options = this.getNodeParameter('options', i) as IDataObject;
            const limit = (options.limit as number) || 25;
            const page = options.page as number | undefined;
            const query = updateQueries.listUpdates(limit, page);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.updates as IDataObject[]) || [];
          } else if (operation === 'getUpdate') {
            const updateId = this.getNodeParameter('updateId', i) as string;
            const query = updateQueries.getUpdate(updateId);
            const response = await mondayComApiRequest.call(this, query);
            const updates = response.updates as IDataObject[];
            responseData = updates?.[0] || {};
          } else if (operation === 'createUpdate') {
            const itemId = this.getNodeParameter('itemIdForUpdate', i) as string;
            const body = this.getNodeParameter('body', i) as string;
            const query = updateMutations.createUpdate(itemId, body);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.create_update as IDataObject) || {};
          } else if (operation === 'editUpdate') {
            const updateId = this.getNodeParameter('updateId', i) as string;
            const body = this.getNodeParameter('body', i) as string;
            const query = updateMutations.editUpdate(updateId, body);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.edit_update as IDataObject) || {};
          } else if (operation === 'deleteUpdate') {
            const updateId = this.getNodeParameter('updateId', i) as string;
            const query = updateMutations.deleteUpdate(updateId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.delete_update as IDataObject) || {};
          } else if (operation === 'likeUpdate') {
            const updateId = this.getNodeParameter('updateId', i) as string;
            const query = updateMutations.likeUpdate(updateId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.like_update as IDataObject) || {};
          } else if (operation === 'getReplies') {
            const updateId = this.getNodeParameter('updateId', i) as string;
            const query = updateQueries.getReplies(updateId);
            const response = await mondayComApiRequest.call(this, query);
            const updates = response.updates as IDataObject[];
            responseData = (updates?.[0]?.replies as IDataObject[]) || [];
          } else if (operation === 'createReply') {
            const updateId = this.getNodeParameter('updateId', i) as string;
            const body = this.getNodeParameter('body', i) as string;
            const query = updateMutations.createReply(updateId, body);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.create_update as IDataObject) || {};
          }
        }

        // ==================== TAG OPERATIONS ====================
        else if (resource === 'tag') {
          if (operation === 'listTags') {
            const query = tagQueries.listTags();
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.tags as IDataObject[]) || [];
          } else if (operation === 'getTag') {
            const tagId = this.getNodeParameter('tagId', i) as string;
            const query = tagQueries.getTag(tagId);
            const response = await mondayComApiRequest.call(this, query);
            const tags = response.tags as IDataObject[];
            responseData = tags?.[0] || {};
          } else if (operation === 'createTag') {
            const tagName = this.getNodeParameter('tagName', i) as string;
            const query = tagMutations.createTag(tagName);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.create_or_get_tag as IDataObject) || {};
          } else if (operation === 'addTagToBoard') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const tagName = this.getNodeParameter('tagName', i) as string;
            const query = tagMutations.addTagToBoard(boardId, tagName);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.create_or_get_tag as IDataObject) || {};
          }
        }

        // ==================== FILE OPERATIONS ====================
        else if (resource === 'file') {
          if (operation === 'getAssets') {
            const assetIdsStr = this.getNodeParameter('assetIds', i) as string;
            const assetIds = assetIdsStr.split(',').map((id) => id.trim());
            const query = fileQueries.getAssets(assetIds);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.assets as IDataObject[]) || [];
          } else if (operation === 'uploadFileToColumn') {
            // Board ID not directly needed for add_file_to_column but used for context in UI
            this.getNodeParameter('fileBoardId', i); // Fetch to validate parameter exists
            const itemId = this.getNodeParameter('fileItemId', i) as string;
            const columnId = this.getNodeParameter('fileColumnId', i) as string;
            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

            const query = `mutation ($file: File!) {
              add_file_to_column(
                item_id: ${itemId}
                column_id: "${columnId}"
                file: $file
              ) {
                id
                name
                url
              }
            }`;

            const variables = { file: null };
            const response = await mondayComFileUpload.call(this, i, query, variables, binaryPropertyName);
            responseData = (response.add_file_to_column as IDataObject) || {};
          } else if (operation === 'uploadFileToUpdate') {
            const updateId = this.getNodeParameter('fileUpdateId', i) as string;
            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

            const query = `mutation ($file: File!) {
              add_file_to_update(
                update_id: ${updateId}
                file: $file
              ) {
                id
                name
                url
              }
            }`;

            const variables = { file: null };
            const response = await mondayComFileUpload.call(this, i, query, variables, binaryPropertyName);
            responseData = (response.add_file_to_update as IDataObject) || {};
          } else if (operation === 'addFileToColumn') {
            const itemId = this.getNodeParameter('fileItemId', i) as string;
            const columnId = this.getNodeParameter('fileColumnId', i) as string;
            // File URL param exists for UI but API requires actual file upload
            this.getNodeParameter('fileUrl', i); // Validate parameter exists

            const query = `mutation {
              change_column_value(
                item_id: ${itemId}
                column_id: "${columnId}"
                value: ${JSON.stringify(JSON.stringify({ clear_all: true }))}
              ) {
                id
              }
            }`;
            await mondayComApiRequest.call(this, query);

            // Note: Monday.com doesn't have a direct "add file URL" API
            // Files must be uploaded. This operation would need to download and re-upload
            responseData = { message: 'File URL operations require direct file upload' };
          } else if (operation === 'deleteAsset') {
            const assetIdsStr = this.getNodeParameter('assetIds', i) as string;
            const assetId = assetIdsStr.split(',')[0].trim();

            // Note: Monday.com API doesn't have a direct delete_asset mutation
            // Assets are managed through column values
            responseData = { message: 'Asset deletion is managed through column value updates', assetId };
          }
        }

        // ==================== NOTIFICATION OPERATIONS ====================
        else if (resource === 'notification') {
          if (operation === 'createNotification') {
            const userId = this.getNodeParameter('userId', i) as string;
            const targetId = this.getNodeParameter('targetId', i) as string;
            const text = this.getNodeParameter('notificationText', i) as string;
            const targetType = this.getNodeParameter('targetType', i) as string;
            const query = notificationMutations.createNotification(userId, targetId, text, targetType);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.create_notification as IDataObject) || {};
          }
        }

        // ==================== WEBHOOK OPERATIONS ====================
        else if (resource === 'webhook') {
          if (operation === 'listWebhooks') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const query = webhookQueries.listWebhooks(boardId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.webhooks as IDataObject[]) || [];
          } else if (operation === 'createWebhook') {
            const boardId = this.getNodeParameter('boardId', i) as string;
            const url = this.getNodeParameter('webhookUrl', i) as string;
            const event = this.getNodeParameter('webhookEvent', i) as string;
            const query = webhookMutations.createWebhook(boardId, url, event);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.create_webhook as IDataObject) || {};
          } else if (operation === 'deleteWebhook') {
            const webhookId = this.getNodeParameter('webhookId', i) as string;
            const query = webhookMutations.deleteWebhook(webhookId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.delete_webhook as IDataObject) || {};
          }
        }

        // ==================== APP OPERATIONS ====================
        else if (resource === 'app') {
          if (operation === 'getInstalledApps') {
            const query = appQueries.getInstalledApps();
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.apps_installs as IDataObject[]) || [];
          } else if (operation === 'getAppSubscription') {
            const query = appQueries.getAppSubscription();
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.app_subscription as IDataObject) || {};
          } else if (operation === 'getAppMonetizationStatus') {
            const query = appQueries.getAppMonetizationStatus();
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.app_monetization_status as IDataObject) || {};
          }
        }

        // ==================== ACCOUNT OPERATIONS ====================
        else if (resource === 'account') {
          if (operation === 'getAccount') {
            const query = accountQueries.getAccount();
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.account as IDataObject) || {};
          } else if (operation === 'getAccountPlan') {
            const query = accountQueries.getAccountPlan();
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.account as IDataObject) || {};
          }
        }

        // ==================== DOC OPERATIONS ====================
        else if (resource === 'doc') {
          if (operation === 'listDocs') {
            const options = this.getNodeParameter('options', i) as IDataObject;
            const limit = (options.limit as number) || 25;
            const page = options.page as number | undefined;
            const workspaceId = options.workspaceId as string | undefined;
            const query = docQueries.listDocs(limit, page, workspaceId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.docs as IDataObject[]) || [];
          } else if (operation === 'getDoc') {
            const docId = this.getNodeParameter('docId', i) as string;
            const query = docQueries.getDoc(docId);
            const response = await mondayComApiRequest.call(this, query);
            const docs = response.docs as IDataObject[];
            responseData = docs?.[0] || {};
          } else if (operation === 'createDoc') {
            const workspaceId = this.getNodeParameter('workspaceId', i) as string;
            const query = docMutations.createDoc(workspaceId, '', 'public');
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.create_doc as IDataObject) || {};
          } else if (operation === 'createDocBlock') {
            const docId = this.getNodeParameter('docId', i) as string;
            const blockType = this.getNodeParameter('blockType', i) as string;
            const content = this.getNodeParameter('blockContent', i) as string;
            const query = docMutations.createDocBlock(docId, blockType, content);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.create_doc_block as IDataObject) || {};
          } else if (operation === 'getDocBlocks') {
            const docId = this.getNodeParameter('docId', i) as string;
            const query = docQueries.getDocBlocks(docId);
            const response = await mondayComApiRequest.call(this, query);
            const docs = response.docs as IDataObject[];
            responseData = (docs?.[0]?.blocks as IDataObject[]) || [];
          }
        }

        // ==================== FOLDER OPERATIONS ====================
        else if (resource === 'folder') {
          if (operation === 'listFolders') {
            const workspaceId = this.getNodeParameter('workspaceId', i) as string;
            const query = folderQueries.listFolders(workspaceId, 100);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.folders as IDataObject[]) || [];
          } else if (operation === 'getFolder') {
            const folderId = this.getNodeParameter('folderId', i) as string;
            const query = folderQueries.getFolder(folderId);
            const response = await mondayComApiRequest.call(this, query);
            const folders = response.folders as IDataObject[];
            responseData = folders?.[0] || {};
          } else if (operation === 'createFolder') {
            const workspaceId = this.getNodeParameter('workspaceId', i) as string;
            const name = this.getNodeParameter('folderName', i) as string;
            const query = folderMutations.createFolder(workspaceId, name);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.create_folder as IDataObject) || {};
          } else if (operation === 'updateFolder') {
            const folderId = this.getNodeParameter('folderId', i) as string;
            const name = this.getNodeParameter('folderName', i) as string;
            const query = folderMutations.updateFolder(folderId, name);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.update_folder as IDataObject) || {};
          } else if (operation === 'deleteFolder') {
            const folderId = this.getNodeParameter('folderId', i) as string;
            const query = folderMutations.deleteFolder(folderId);
            const response = await mondayComApiRequest.call(this, query);
            responseData = (response.delete_folder as IDataObject) || {};
          }
        }

        // Return the data
        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData),
          { itemData: { item: i } },
        );
        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
