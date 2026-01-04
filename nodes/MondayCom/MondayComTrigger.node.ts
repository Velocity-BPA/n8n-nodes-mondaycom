import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import { mondayComApiRequest } from './transport/client';

export class MondayComTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Monday.com Trigger',
		name: 'mondayComTrigger',
		icon: 'file:mondaycom.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts the workflow when Monday.com events occur',
		defaults: {
			name: 'Monday.com Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'mondayComApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Board Name or ID',
				name: 'boardId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getBoards',
				},
				required: true,
				default: '',
				description: 'The board to watch for events. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'create_item',
				options: [
					{
						name: 'Board Column Deleted',
						value: 'delete_column',
						description: 'Triggers when a column is deleted from the board',
					},
					{
						name: 'Board Deleted',
						value: 'delete_board',
						description: 'Triggers when the board is deleted',
					},
					{
						name: 'Column Value Changed',
						value: 'change_column_value',
						description: 'Triggers when any column value changes on an item',
					},
					{
						name: 'Create Column',
						value: 'create_column',
						description: 'Triggers when a new column is created',
					},
					{
						name: 'Create Subitem',
						value: 'create_subitem',
						description: 'Triggers when a subitem is created',
					},
					{
						name: 'Create Subitem Update',
						value: 'create_subitem_update',
						description: 'Triggers when an update is posted on a subitem',
					},
					{
						name: 'Create Update',
						value: 'create_update',
						description: 'Triggers when an update/comment is posted',
					},
					{
						name: 'Edit Update',
						value: 'edit_update',
						description: 'Triggers when an update is edited',
					},
					{
						name: 'Delete Update',
						value: 'delete_update',
						description: 'Triggers when an update is deleted',
					},
					{
						name: 'Item Archived',
						value: 'archive_item',
						description: 'Triggers when an item is archived',
					},
					{
						name: 'Item Created',
						value: 'create_item',
						description: 'Triggers when a new item is created',
					},
					{
						name: 'Item Deleted',
						value: 'delete_item',
						description: 'Triggers when an item is deleted',
					},
					{
						name: 'Item Moved to Group',
						value: 'move_item_to_group',
						description: 'Triggers when an item is moved to a different group',
					},
					{
						name: 'Item Name Changed',
						value: 'change_name',
						description: 'Triggers when an item name is changed',
					},
					{
						name: 'Item Restored',
						value: 'restore_item',
						description: 'Triggers when an item is restored from archive',
					},
					{
						name: 'Specific Column Value Changed',
						value: 'change_specific_column_value',
						description: 'Triggers when a specific column value changes',
					},
					{
						name: 'Status Column Changed',
						value: 'change_status_column_value',
						description: 'Triggers when a status column changes',
					},
					{
						name: 'Subitem Archived',
						value: 'archive_subitem',
						description: 'Triggers when a subitem is archived',
					},
					{
						name: 'Subitem Deleted',
						value: 'delete_subitem',
						description: 'Triggers when a subitem is deleted',
					},
					{
						name: 'Subitem Name Changed',
						value: 'change_subitem_name',
						description: 'Triggers when a subitem name is changed',
					},
					{
						name: 'Subitem Column Value Changed',
						value: 'change_subitem_column_value',
						description: 'Triggers when a subitem column value changes',
					},
				],
				description: 'The event to listen for',
			},
			{
				displayName: 'Column Name or ID',
				name: 'columnId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getColumns',
					loadOptionsDependsOn: ['boardId'],
				},
				displayOptions: {
					show: {
						event: ['change_specific_column_value'],
					},
				},
				required: true,
				default: '',
				description: 'The column to watch for changes. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Config',
				name: 'config',
				type: 'json',
				displayOptions: {
					show: {
						event: ['change_status_column_value'],
					},
				},
				default: '{}',
				description: 'Optional JSON config for status column triggers. Example: {"columnId": "status", "columnValue": {"index": 1}}',
			},
		],
	};

	methods = {
		loadOptions: {
			async getBoards(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const query = `query {
					boards(limit: 200) {
						id
						name
						state
					}
				}`;

				const response = await mondayComApiRequest.call(this, query);
				const boards = (response.boards as IDataObject[] | undefined) || [];

				return (boards as IDataObject[])
					.filter((board: IDataObject) => board.state === 'active')
					.map((board: IDataObject) => ({
						name: board.name as string,
						value: board.id as string,
					}));
			},

			async getColumns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const boardId = this.getCurrentNodeParameter('boardId') as string;

				if (!boardId) {
					return [];
				}

				const query = `query {
					boards(ids: [${boardId}]) {
						columns {
							id
							title
							type
						}
					}
				}`;

				const response = await mondayComApiRequest.call(this, query);
				const boardsData = (response.boards as IDataObject[] | undefined) || [];
				const firstBoard = boardsData[0] as IDataObject | undefined;
				const columns = ((firstBoard?.columns as IDataObject[] | undefined) || []) as IDataObject[];

				return columns.map((column: IDataObject) => ({
					name: `${column.title} (${column.type})`,
					value: column.id as string,
				}));
			},
		},
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const boardId = this.getNodeParameter('boardId') as string;

				const query = `query {
					boards(ids: [${boardId}]) {
						webhooks {
							id
							url
							event
						}
					}
				}`;

				try {
					const response = await mondayComApiRequest.call(this, query);
					const boardsData = (response.boards as IDataObject[] | undefined) || [];
					const firstBoard = boardsData[0] as IDataObject | undefined;
					const webhooks = ((firstBoard?.webhooks as IDataObject[] | undefined) || []) as IDataObject[];

					for (const webhook of webhooks) {
						if ((webhook as IDataObject).url === webhookUrl) {
							webhookData.webhookId = (webhook as IDataObject).id as string;
							return true;
						}
					}
				} catch (error) {
					return false;
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const boardId = this.getNodeParameter('boardId') as string;
				const event = this.getNodeParameter('event') as string;

				let config: IDataObject = {};

				// Handle specific column value change event
				if (event === 'change_specific_column_value') {
					const columnId = this.getNodeParameter('columnId') as string;
					config = { columnId };
				}

				// Handle status column value change event
				if (event === 'change_status_column_value') {
					const configJson = this.getNodeParameter('config', '{}') as string;
					try {
						config = JSON.parse(configJson) as IDataObject;
					} catch {
						config = {};
					}
				}

				const configStr = Object.keys(config).length > 0
					? `, config: ${JSON.stringify(JSON.stringify(config))}`
					: '';

				const mutation = `mutation {
					create_webhook(
						board_id: ${boardId},
						url: "${webhookUrl}",
						event: ${event}${configStr}
					) {
						id
						board_id
						url
						event
					}
				}`;

				try {
					const response = await mondayComApiRequest.call(this, mutation);
					const webhookData = this.getWorkflowStaticData('node');
					const createWebhook = response.create_webhook as IDataObject | undefined;

					if (createWebhook?.id) {
						webhookData.webhookId = createWebhook.id as string;
						return true;
					}
				} catch (error) {
					throw new NodeApiError(this.getNode(), error as JsonObject, {
						message: 'Failed to create webhook',
					});
				}

				return false;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookId = webhookData.webhookId as string;

				if (!webhookId) {
					return true;
				}

				const mutation = `mutation {
					delete_webhook(id: ${webhookId}) {
						id
					}
				}`;

				try {
					await mondayComApiRequest.call(this, mutation);
				} catch (error) {
					return false;
				}

				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;

		// Monday.com sends a challenge for webhook verification
		if (bodyData.challenge) {
			return {
				webhookResponse: {
					body: { challenge: bodyData.challenge },
					headers: {
						'Content-Type': 'application/json',
					},
				},
			};
		}

		// Process the webhook event
		const event = bodyData.event as IDataObject;

		if (!event) {
			return {
				workflowData: [
					this.helpers.returnJsonArray([bodyData]),
				],
			};
		}

		// Enrich the event data with additional context
		const enrichedEvent: IDataObject = {
			...event,
			webhookEvent: bodyData.type || 'unknown',
			timestamp: new Date().toISOString(),
		};

		// If item data is available, try to fetch additional details
		if (event.pulseId || event.itemId) {
			const itemId = (event.pulseId || event.itemId) as string;
			enrichedEvent.itemId = itemId;

			try {
				const query = `query {
					items(ids: [${itemId}]) {
						id
						name
						state
						created_at
						updated_at
						group {
							id
							title
						}
						board {
							id
							name
						}
						column_values {
							id
							type
							text
							value
						}
					}
				}`;

				const response = await mondayComApiRequest.call(this, query);
				const itemsArr = (response.items || []) as IDataObject[];
				const item = itemsArr[0] as IDataObject | undefined;

				if (item) {
					enrichedEvent.item = item;
				}
			} catch {
				// Continue without enrichment if fetch fails
			}
		}

		return {
			workflowData: [
				this.helpers.returnJsonArray([enrichedEvent]),
			],
		};
	}
}
