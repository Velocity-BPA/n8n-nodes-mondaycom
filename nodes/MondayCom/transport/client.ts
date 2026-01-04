/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IDataObject,
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  IWebhookFunctions,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import type { IMondayComApiResponse, IMondayComError } from '../types';
import { MONDAY_COM_API_URL, MONDAY_COM_FILE_UPLOAD_URL } from '../constants/constants';

// License notice - logged once per session
let licenseNoticeShown = false;

function showLicenseNotice(): void {
  if (!licenseNoticeShown) {
    // eslint-disable-next-line no-console
    console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
    licenseNoticeShown = true;
  }
}

export type MondayComContext =
  | IExecuteFunctions
  | ILoadOptionsFunctions
  | IHookFunctions
  | IWebhookFunctions;

/**
 * Make a GraphQL API request to Monday.com
 */
export async function mondayComApiRequest(
  this: MondayComContext,
  query: string,
  variables?: IDataObject,
): Promise<IDataObject> {
  showLicenseNotice();

  const credentials = await this.getCredentials('mondayComApi');
  const baseUrl = (credentials.baseUrl as string) || MONDAY_COM_API_URL;
  const apiVersion = credentials.apiVersion as string | undefined;

  const headers: IDataObject = {
    'Content-Type': 'application/json',
    Authorization: credentials.apiToken as string,
  };

  if (apiVersion) {
    headers['API-Version'] = apiVersion;
  }

  const body: IDataObject = { query };
  if (variables) {
    body.variables = variables;
  }

  const options = {
    method: 'POST' as const,
    headers,
    body,
    uri: baseUrl,
    json: true,
  };

  try {
    const response = (await this.helpers.request(options)) as IMondayComApiResponse;

    if (response.errors && response.errors.length > 0) {
      throw new NodeApiError(this.getNode(), formatMondayComError(response.errors), {
        message: response.errors[0].message,
      });
    }

    return response.data || {};
  } catch (error) {
    if (error instanceof NodeApiError) {
      throw error;
    }

    const errorData = error as JsonObject;
    throw new NodeApiError(this.getNode(), errorData, {
      message: 'Monday.com API request failed',
    });
  }
}

/**
 * Make a GraphQL API request with pagination support
 */
export async function mondayComApiRequestAllItems(
  this: MondayComContext,
  query: string,
  variables?: IDataObject,
  dataKey?: string,
  limit?: number,
): Promise<IDataObject[]> {
  const returnData: IDataObject[] = [];
  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await mondayComApiRequest.call(this, query, {
      ...variables,
      cursor,
    });

    let items: IDataObject[] = [];
    let nextCursor: string | undefined;

    if (dataKey) {
      const keyParts = dataKey.split('.');
      let data: unknown = response;

      for (const part of keyParts) {
        if (data && typeof data === 'object') {
          data = (data as IDataObject)[part];
        }
      }

      if (Array.isArray(data)) {
        items = data;
      } else if (data && typeof data === 'object') {
        const obj = data as IDataObject;
        if (obj.items && Array.isArray(obj.items)) {
          items = obj.items as IDataObject[];
          nextCursor = obj.cursor as string | undefined;
        }
      }
    } else {
      const boards = response.boards as IDataObject[] | undefined;
      if (boards && boards.length > 0) {
        const firstBoard = boards[0] as IDataObject;
        const itemsPage = firstBoard.items_page as IDataObject | undefined;
        if (itemsPage) {
          items = (itemsPage.items as IDataObject[]) || [];
          nextCursor = itemsPage.cursor as string | undefined;
        }
      }
    }

    returnData.push(...items);

    if (limit && returnData.length >= limit) {
      return returnData.slice(0, limit);
    }

    cursor = nextCursor;
    hasMore = !!cursor;
  }

  return returnData;
}

/**
 * Upload a file to Monday.com
 */
export async function mondayComFileUpload(
  this: IExecuteFunctions,
  itemIndex: number,
  query: string,
  variables: IDataObject,
  binaryPropertyName: string,
): Promise<IDataObject> {
  showLicenseNotice();

  const credentials = await this.getCredentials('mondayComApi');
  const apiVersion = credentials.apiVersion as string | undefined;

  const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);

  const headers: IDataObject = {
    Authorization: credentials.apiToken as string,
  };

  if (apiVersion) {
    headers['API-Version'] = apiVersion;
  }

  let fileContent: Buffer;
  if (binaryData.id) {
    fileContent = await this.helpers.binaryToBuffer(
      await this.helpers.getBinaryStream(binaryData.id),
    );
  } else if (binaryData.data) {
    fileContent = Buffer.from(binaryData.data, 'base64');
  } else {
    throw new NodeApiError(this.getNode(), {
      message: 'No binary data found',
    });
  }

  const formData: IDataObject = {
    query,
    variables: JSON.stringify(variables),
    map: JSON.stringify({ file: 'variables.file' }),
    file: {
      value: fileContent,
      options: {
        filename: binaryData.fileName || 'file',
        contentType: binaryData.mimeType || 'application/octet-stream',
      },
    },
  };

  const options = {
    method: 'POST' as const,
    headers,
    formData,
    uri: MONDAY_COM_FILE_UPLOAD_URL,
    json: true,
  };

  try {
    const response = (await this.helpers.request(options)) as IMondayComApiResponse;

    if (response.errors && response.errors.length > 0) {
      throw new NodeApiError(this.getNode(), formatMondayComError(response.errors), {
        message: response.errors[0].message,
      });
    }

    return response.data || {};
  } catch (error) {
    if (error instanceof NodeApiError) {
      throw error;
    }

    const errorData = error as JsonObject;
    throw new NodeApiError(this.getNode(), errorData, {
      message: 'Monday.com file upload failed',
    });
  }
}

/**
 * Format Monday.com GraphQL errors
 */
function formatMondayComError(errors: IMondayComError[]): JsonObject {
  const firstError = errors[0];
  const errorDetails: JsonObject = {
    message: firstError.message,
  };

  if (firstError.extensions) {
    const code = firstError.extensions.code || firstError.extensions.error_code;
    const statusCode = firstError.extensions.status_code;
    if (code !== undefined) {
      errorDetails.code = code;
    }
    if (statusCode !== undefined) {
      errorDetails.statusCode = statusCode;
    }
  }

  if (firstError.path) {
    errorDetails.path = firstError.path.join('.');
  }

  if (firstError.locations) {
    errorDetails.locations = firstError.locations;
  }

  return errorDetails;
}

/**
 * Get board options for dropdown
 */
export async function getBoardOptions(
  this: ILoadOptionsFunctions,
): Promise<Array<{ name: string; value: string }>> {
  const query = `
    query {
      boards(limit: 100) {
        id
        name
      }
    }
  `;

  const response = await mondayComApiRequest.call(this, query);
  const boards = response.boards as Array<{ id: string; name: string }>;

  return boards.map((board) => ({
    name: board.name,
    value: board.id,
  }));
}

/**
 * Get group options for a board
 */
export async function getGroupOptions(
  this: ILoadOptionsFunctions,
  boardId: string,
): Promise<Array<{ name: string; value: string }>> {
  const query = `
    query {
      boards(ids: [${boardId}]) {
        groups {
          id
          title
        }
      }
    }
  `;

  const response = await mondayComApiRequest.call(this, query);
  const boards = response.boards as Array<{ groups: Array<{ id: string; title: string }> }>;

  if (!boards || boards.length === 0) {
    return [];
  }

  return boards[0].groups.map((group) => ({
    name: group.title,
    value: group.id,
  }));
}

/**
 * Get column options for a board
 */
export async function getColumnOptions(
  this: ILoadOptionsFunctions,
  boardId: string,
): Promise<Array<{ name: string; value: string; description?: string }>> {
  const query = `
    query {
      boards(ids: [${boardId}]) {
        columns {
          id
          title
          type
        }
      }
    }
  `;

  const response = await mondayComApiRequest.call(this, query);
  const boards = response.boards as Array<{
    columns: Array<{ id: string; title: string; type: string }>;
  }>;

  if (!boards || boards.length === 0) {
    return [];
  }

  return boards[0].columns.map((column) => ({
    name: column.title,
    value: column.id,
    description: `Type: ${column.type}`,
  }));
}

/**
 * Get workspace options
 */
export async function getWorkspaceOptions(
  this: ILoadOptionsFunctions,
): Promise<Array<{ name: string; value: string }>> {
  const query = `
    query {
      workspaces(limit: 100) {
        id
        name
      }
    }
  `;

  const response = await mondayComApiRequest.call(this, query);
  const workspaces = response.workspaces as Array<{ id: string; name: string }>;

  return workspaces.map((workspace) => ({
    name: workspace.name,
    value: workspace.id,
  }));
}

/**
 * Get user options
 */
export async function getUserOptions(
  this: ILoadOptionsFunctions,
): Promise<Array<{ name: string; value: string }>> {
  const query = `
    query {
      users(limit: 100) {
        id
        name
        email
      }
    }
  `;

  const response = await mondayComApiRequest.call(this, query);
  const users = response.users as Array<{ id: string; name: string; email: string }>;

  return users.map((user) => ({
    name: `${user.name} (${user.email})`,
    value: user.id,
  }));
}

/**
 * Get team options
 */
export async function getTeamOptions(
  this: ILoadOptionsFunctions,
): Promise<Array<{ name: string; value: string }>> {
  const query = `
    query {
      teams {
        id
        name
      }
    }
  `;

  const response = await mondayComApiRequest.call(this, query);
  const teams = response.teams as Array<{ id: string; name: string }>;

  return teams.map((team) => ({
    name: team.name,
    value: team.id,
  }));
}
