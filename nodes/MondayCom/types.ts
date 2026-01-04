/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

// API Response Types
export interface IMondayComApiResponse {
  data?: IDataObject;
  errors?: IMondayComError[];
  account_id?: number;
}

export interface IMondayComError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: string[];
  extensions?: {
    code?: string;
    error_code?: string;
    status_code?: number;
  };
}

// Board Types
export interface IBoard {
  id: string;
  name: string;
  description?: string;
  board_folder_id?: string;
  board_kind: 'public' | 'private' | 'share';
  columns?: IColumn[];
  groups?: IGroup[];
  items_page?: IItemsPage;
  owner?: IUser;
  permissions?: string;
  state: 'active' | 'archived' | 'deleted' | 'all';
  subscribers?: IUser[];
  tags?: ITag[];
  type?: string;
  updated_at?: string;
  workspace?: IWorkspace;
  workspace_id?: string;
}

export interface IItemsPage {
  cursor?: string;
  items: IItem[];
}

// Column Types
export interface IColumn {
  id: string;
  title: string;
  type: ColumnType;
  archived?: boolean;
  description?: string;
  settings_str?: string;
  width?: number;
}

export type ColumnType =
  | 'auto_number'
  | 'board_relation'
  | 'button'
  | 'checkbox'
  | 'color_picker'
  | 'country'
  | 'creation_log'
  | 'date'
  | 'dependency'
  | 'doc'
  | 'dropdown'
  | 'email'
  | 'file'
  | 'formula'
  | 'hour'
  | 'item_assignees'
  | 'item_id'
  | 'last_updated'
  | 'link'
  | 'location'
  | 'long_text'
  | 'mirror'
  | 'name'
  | 'numbers'
  | 'people'
  | 'phone'
  | 'progress'
  | 'rating'
  | 'status'
  | 'subtasks'
  | 'tags'
  | 'team'
  | 'text'
  | 'timeline'
  | 'time_tracking'
  | 'vote'
  | 'week'
  | 'world_clock';

// Group Types
export interface IGroup {
  id: string;
  title: string;
  archived?: boolean;
  color?: string;
  deleted?: boolean;
  position?: string;
}

// Item Types
export interface IItem {
  id: string;
  name: string;
  board?: IBoard;
  column_values?: IColumnValue[];
  created_at?: string;
  creator?: IUser;
  creator_id?: string;
  group?: IGroup;
  parent_item?: IItem;
  state?: 'active' | 'archived' | 'deleted' | 'all';
  subitems?: IItem[];
  subscribers?: IUser[];
  updated_at?: string;
  updates?: IUpdate[];
}

export interface IColumnValue {
  id: string;
  text?: string;
  type: ColumnType;
  value?: string;
  column?: IColumn;
}

// User Types
export interface IUser {
  id: string;
  name: string;
  email: string;
  account?: IAccount;
  birthday?: string;
  country_code?: string;
  created_at?: string;
  current_language?: string;
  enabled?: boolean;
  is_admin?: boolean;
  is_guest?: boolean;
  is_pending?: boolean;
  is_view_only?: boolean;
  join_date?: string;
  last_activity?: string;
  location?: string;
  mobile_phone?: string;
  phone?: string;
  photo_original?: string;
  photo_small?: string;
  photo_thumb?: string;
  photo_thumb_small?: string;
  photo_tiny?: string;
  teams?: ITeam[];
  time_zone_identifier?: string;
  title?: string;
  url?: string;
  utc_hours_diff?: number;
}

// Team Types
export interface ITeam {
  id: string;
  name: string;
  owners?: IUser[];
  picture_url?: string;
  users?: IUser[];
}

// Workspace Types
export interface IWorkspace {
  id: string;
  name: string;
  account_product?: IAccountProduct;
  created_at?: string;
  description?: string;
  is_default_workspace?: boolean;
  kind?: 'open' | 'closed';
  owners_subscribers?: IUser[];
  settings?: IWorkspaceSettings;
  state?: 'active' | 'archived' | 'deleted' | 'all';
  team_owners_subscribers?: ITeam[];
  teams_subscribers?: ITeam[];
  users_subscribers?: IUser[];
}

export interface IWorkspaceSettings {
  icon?: IWorkspaceIcon;
}

export interface IWorkspaceIcon {
  color?: string;
  image?: string;
}

// Account Types
export interface IAccount {
  id: string;
  name: string;
  active_members_count?: number;
  country_code?: string;
  first_day_of_the_week?: string;
  logo?: string;
  plan?: IAccountPlan;
  products?: IAccountProduct[];
  show_timeline_weekends?: boolean;
  sign_up_product_kind?: string;
  slug?: string;
  tier?: string;
}

export interface IAccountPlan {
  max_users?: number;
  period?: string;
  tier?: string;
  version?: number;
}

export interface IAccountProduct {
  id?: string;
  kind?: string;
}

// Update (Comments) Types
export interface IUpdate {
  id: string;
  body?: string;
  created_at?: string;
  creator?: IUser;
  creator_id?: string;
  item_id?: string;
  replies?: IUpdate[];
  text_body?: string;
  updated_at?: string;
}

// Tag Types
export interface ITag {
  id: string;
  name: string;
  color?: string;
}

// File/Asset Types
export interface IAsset {
  id: string;
  name?: string;
  created_at?: string;
  file_extension?: string;
  file_size?: number;
  original_geometry?: string;
  public_url?: string;
  uploaded_by?: IUser;
  url?: string;
  url_thumbnail?: string;
}

// Webhook Types
export interface IWebhook {
  id: string;
  board_id: string;
  config?: string;
  event?: WebhookEventType;
}

export type WebhookEventType =
  | 'change_column_value'
  | 'change_name'
  | 'change_status_column_value'
  | 'change_specific_column_value'
  | 'create_column'
  | 'create_item'
  | 'create_subitem'
  | 'create_subitem_update'
  | 'create_update'
  | 'delete_item'
  | 'edit_update'
  | 'item_archived'
  | 'item_deleted'
  | 'item_moved_to_any_group'
  | 'item_moved_to_specific_group'
  | 'item_restored'
  | 'move_item'
  | 'subitem_archived'
  | 'subitem_deleted';

// Doc Types
export interface IDoc {
  id: string;
  name?: string;
  blocks?: IDocBlock[];
  created_at?: string;
  created_by?: IUser;
  doc_folder_id?: string;
  doc_kind?: 'public' | 'private' | 'share';
  object_id?: string;
  relative_url?: string;
  settings?: IDataObject;
  url?: string;
  workspace?: IWorkspace;
  workspace_id?: string;
}

export interface IDocBlock {
  id: string;
  content?: string;
  created_at?: string;
  parent_block_id?: string;
  type?: string;
  updated_at?: string;
}

// Folder Types
export interface IFolder {
  id: string;
  name: string;
  color?: string;
  created_at?: string;
  owner_id?: string;
  parent_folder_id?: string;
  children?: IFolder[];
  workspace_id?: string;
}

// App Types
export interface IApp {
  id: string;
  name?: string;
}

export interface IAppSubscription {
  billing_period?: string;
  days_left?: number;
  is_trial?: boolean;
  plan_id?: string;
  renewal_date?: string;
}

// Notification Types
export interface INotification {
  id?: string;
  text?: string;
}

// Column Value Formats
export interface IStatusColumnValue {
  index?: number;
  label?: string;
}

export interface IPeopleColumnValue {
  personsAndTeams: Array<{
    id: number;
    kind: 'person' | 'team';
  }>;
}

export interface IDateColumnValue {
  date: string;
  time?: string;
}

export interface ITimelineColumnValue {
  from: string;
  to: string;
}

export interface ILinkColumnValue {
  url: string;
  text?: string;
}

export interface IDropdownColumnValue {
  labels: string[];
}

export interface IHourColumnValue {
  hour: number;
  minute: number;
}

export interface ICheckboxColumnValue {
  checked: 'true' | 'false';
}

// Request Types
export interface IGraphQLRequest {
  query: string;
  variables?: IDataObject;
}

// Pagination Types
export interface IPaginationOptions {
  cursor?: string;
  limit?: number;
}

export interface IPaginatedResponse<T> {
  items: T[];
  cursor?: string;
}
