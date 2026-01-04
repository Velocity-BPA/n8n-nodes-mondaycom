/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class MondayComApi implements ICredentialType {
  name = 'mondayComApi';
  displayName = 'Monday.com API';
  documentationUrl = 'https://developer.monday.com/api-reference/docs';
  properties: INodeProperties[] = [
    {
      displayName: 'API Token',
      name: 'apiToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description:
        'Your Monday.com API token. Can be a Personal API Token or an App Token. Find it in Admin > API.',
    },
    {
      displayName: 'API Version',
      name: 'apiVersion',
      type: 'string',
      default: '',
      placeholder: '2024-10',
      description:
        'Optional: Pin to a specific API version (e.g., 2024-10). Leave empty to use the latest version.',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://api.monday.com/v2',
      description: 'The Monday.com API base URL',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '={{$credentials.apiToken}}',
        'Content-Type': 'application/json',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '',
      method: 'POST',
      body: {
        query: '{ me { id name email } }',
      },
    },
  };
}
