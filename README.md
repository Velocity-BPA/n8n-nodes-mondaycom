# n8n-nodes-mondaycom

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Monday.com, providing 16 resource categories and 100+ operations for complete work OS automation. Includes webhook triggers, GraphQL API integration, and support for all Monday.com column types.

![n8n](https://img.shields.io/badge/n8n-community--node-brightgreen)
![Monday.com](https://img.shields.io/badge/Monday.com-work%20OS-ff3d57)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **16 Resource Categories**: Boards, Items, Columns, Groups, Workspaces, Users, Teams, Updates, Tags, Files, Notifications, Webhooks, Apps, Account, Docs, and Folders
- **100+ Operations**: Complete coverage of Monday.com's GraphQL API
- **Webhook Triggers**: Real-time event notifications for 20+ event types
- **Full Column Support**: All 30+ Monday.com column types with proper value formatting
- **Cursor-Based Pagination**: Efficient handling of large datasets
- **File Upload Support**: Upload files to columns and updates
- **GraphQL over HTTP**: No external GraphQL client dependencies

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-mondaycom`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-mondaycom

# Restart n8n
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-mondaycom.git
cd n8n-nodes-mondaycom

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-mondaycom

# Restart n8n
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Token | Monday.com API token (Personal or App token) | Yes |
| API Version | API version for pinning (e.g., `2024-10`) | No |
| Base URL | API base URL (default: `https://api.monday.com/v2`) | No |

### Getting Your API Token

1. Log in to your Monday.com account
2. Click your profile picture > **Developers**
3. Go to **My Access Tokens**
4. Click **Show** to reveal your token, or generate a new one
5. Copy the token and paste it into the n8n credentials

## Resources & Operations

### Board
| Operation | Description |
|-----------|-------------|
| List | Query boards with filters |
| Get | Get board by ID |
| Create | Create new board |
| Duplicate | Duplicate existing board |
| Archive | Archive board |
| Delete | Delete board permanently |
| Get Columns | Get board columns |
| Get Groups | Get board groups |
| Get Items | Get items with pagination |
| Get Views | Get board views |
| Get Activity | Get board activity log |
| Update Column | Update column settings |
| Add Subscriber | Add user to board |
| Remove Subscriber | Remove user from board |

### Item
| Operation | Description |
|-----------|-------------|
| List | Query items by ID |
| Get | Get item by ID |
| Create | Create new item in board |
| Duplicate | Duplicate item |
| Move to Group | Move item to different group |
| Move to Board | Move item to different board |
| Archive | Archive item |
| Delete | Delete item permanently |
| Change Column Value | Update single column value |
| Change Multiple Values | Update multiple columns |
| Clear Updates | Clear item updates |
| Get Column Values | Get all column values |
| Get Subitems | Get subitems |
| Create Subitem | Create subitem |
| Get Updates | Get item updates/comments |
| Get Linked Items | Get linked items |

### Column
| Operation | Description |
|-----------|-------------|
| List | Get columns for board |
| Get | Get column by ID |
| Create | Create new column |
| Change Title | Update column title |
| Change Description | Update description |
| Delete | Delete column |
| Change Metadata | Update column settings |

### Group
| Operation | Description |
|-----------|-------------|
| List | Get groups for board |
| Get | Get group by ID |
| Create | Create new group |
| Duplicate | Duplicate group |
| Archive | Archive group |
| Delete | Delete group permanently |
| Move to Board | Move group to board |
| Update | Update group properties |

### Workspace
| Operation | Description |
|-----------|-------------|
| List | Get all workspaces |
| Get | Get workspace by ID |
| Create | Create workspace |
| Update | Update workspace |
| Delete | Delete workspace |
| Add Users | Add users to workspace |
| Remove Users | Remove users from workspace |
| Add Teams | Add teams to workspace |
| Get Boards | Get boards in workspace |
| Get Users | Get workspace members |

### User
| Operation | Description |
|-----------|-------------|
| List | Get all users |
| Get | Get user by ID |
| Get Current User | Get authenticated user |
| Get Teams | Get teams for user |
| Get Boards | Get boards user can access |

### Team
| Operation | Description |
|-----------|-------------|
| List | Get all teams |
| Get | Get team by ID |
| Create | Create team (Enterprise) |
| Delete | Delete team |
| Add Users | Add users to team |
| Remove Users | Remove users from team |

### Update (Comments)
| Operation | Description |
|-----------|-------------|
| List | Get updates with filters |
| Get | Get update by ID |
| Create | Create update/comment on item |
| Edit | Edit existing update |
| Delete | Delete update |
| Like | Like an update |
| Get Replies | Get replies to update |
| Create Reply | Reply to update |

### Tag
| Operation | Description |
|-----------|-------------|
| List | Get all tags |
| Get | Get tag by ID |
| Create | Create new tag |
| Add to Board | Create/add tag to board |
| Remove from Item | Remove tag from item |

### File
| Operation | Description |
|-----------|-------------|
| Get Assets | Get file assets |
| Upload to Column | Upload file to file column |
| Upload to Update | Upload file to update |
| Add File to Column | Add file URL to column |
| Delete Asset | Delete file asset |

### Notification
| Operation | Description |
|-----------|-------------|
| Create | Send notification to user |

### Webhook
| Operation | Description |
|-----------|-------------|
| List | List webhooks for board |
| Create | Create webhook subscription |
| Delete | Delete webhook |

### App
| Operation | Description |
|-----------|-------------|
| Get Installed Apps | Get installed apps |
| Get Subscription | Get app subscription info |
| Get Monetization Status | Get monetization status |

### Account
| Operation | Description |
|-----------|-------------|
| Get Account | Get account information |
| Get Plan | Get plan details |

### Doc
| Operation | Description |
|-----------|-------------|
| List | Get documents |
| Get | Get document by ID |
| Create | Create document |
| Create Block | Add block to document |
| Get Blocks | Get document blocks |

### Folder
| Operation | Description |
|-----------|-------------|
| List | Get folders in workspace |
| Get | Get folder by ID |
| Create | Create folder |
| Update | Update folder |
| Delete | Delete folder |

## Trigger Node

The Monday.com Trigger node supports the following webhook events:

| Event | Description |
|-------|-------------|
| Item Created | Triggers when a new item is created |
| Item Name Changed | Triggers when an item name is changed |
| Item Archived | Triggers when an item is archived |
| Item Restored | Triggers when an item is restored |
| Item Deleted | Triggers when an item is deleted |
| Item Moved to Group | Triggers when an item is moved |
| Column Value Changed | Triggers when any column changes |
| Specific Column Changed | Triggers when a specific column changes |
| Status Column Changed | Triggers when status column changes |
| Create Update | Triggers when a comment is posted |
| Edit Update | Triggers when a comment is edited |
| Delete Update | Triggers when a comment is deleted |
| Create Subitem | Triggers when a subitem is created |
| Subitem Name Changed | Triggers when subitem name changes |
| Subitem Archived | Triggers when subitem is archived |
| Subitem Deleted | Triggers when subitem is deleted |
| Subitem Column Changed | Triggers when subitem column changes |
| Create Column | Triggers when a column is created |
| Delete Column | Triggers when a column is deleted |
| Board Deleted | Triggers when the board is deleted |

## Usage Examples

### Create a Board and Add Items

```javascript
// 1. Create a new board
{
  "resource": "board",
  "operation": "create",
  "boardName": "Project Tracker",
  "boardKind": "public"
}

// 2. Create an item with column values
{
  "resource": "item",
  "operation": "create",
  "boardId": "{{ $json.id }}",
  "itemName": "Task 1",
  "columnValues": [
    {
      "columnId": "status",
      "columnType": "status",
      "value": { "label": "Working on it" }
    },
    {
      "columnId": "date4",
      "columnType": "date",
      "value": { "date": "2024-12-31" }
    }
  ]
}
```

### Update Item Status

```javascript
{
  "resource": "item",
  "operation": "changeColumnValue",
  "itemId": "1234567890",
  "boardId": "9876543210",
  "columnId": "status",
  "columnType": "status",
  "value": { "label": "Done" }
}
```

### Add a Comment to an Item

```javascript
{
  "resource": "update",
  "operation": "create",
  "itemId": "1234567890",
  "body": "This task has been completed! 🎉"
}
```

## Monday.com Column Types

| Type | Description | Value Format |
|------|-------------|--------------|
| status | Status/label | `{"index": 0}` or `{"label": "Done"}` |
| text | Text field | `"value"` |
| numbers | Number field | `"123"` |
| date | Date | `{"date": "2024-01-15"}` |
| people | Person/team | `{"personsAndTeams": [{"id": 123}]}` |
| dropdown | Dropdown | `{"labels": ["Option1"]}` |
| checkbox | Checkbox | `{"checked": "true"}` |
| link | URL | `{"url": "https://...", "text": "..."}` |
| file | File upload | Asset ID reference |
| timeline | Date range | `{"from": "...", "to": "..."}` |
| hour | Hour | `{"hour": 14, "minute": 30}` |
| email | Email | `{"email": "test@example.com", "text": "..."}` |
| phone | Phone | `{"phone": "+1234567890", "countryShortName": "US"}` |
| rating | Rating | `{"rating": 4}` |
| tags | Tags | `{"tag_ids": [123, 456]}` |
| country | Country | `{"countryCode": "US", "countryName": "United States"}` |
| location | Location | `{"lat": 40.7128, "lng": -74.0060, "address": "..."}` |
| week | Week | `{"week": {"startDate": "...", "endDate": "..."}}` |

## Error Handling

The node handles Monday.com API errors gracefully and provides detailed error messages including:
- Error code and status
- Error message from Monday.com
- Query path that caused the error
- Error locations in the GraphQL query

Enable "Continue on Fail" in node settings to process remaining items when errors occur.

## Rate Limits

Monday.com API has the following rate limits:
- **5,000 complexity points per minute**
- Cursor validity: 60 minutes
- Default page size: 50 items (max 500)

The node handles pagination automatically using cursor-based pagination.

## Security Best Practices

1. **Use App Tokens**: For production, create a dedicated app and use app tokens instead of personal tokens
2. **Limit Scopes**: Only grant necessary permissions to your API token
3. **Rotate Tokens**: Regularly rotate API tokens
4. **Use Test Workspaces**: Test integrations in dedicated test workspaces before production

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code passes linting and tests before submitting.

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-mondaycom/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Velocity-BPA/n8n-nodes-mondaycom/discussions)
- **Monday.com API Docs**: [Monday.com API Documentation](https://developer.monday.com/api-reference/docs)

## Acknowledgments

- [Monday.com](https://monday.com) for their comprehensive GraphQL API
- [n8n](https://n8n.io) for the excellent workflow automation platform
- The n8n community for inspiration and best practices
