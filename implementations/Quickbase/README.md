# Quickbase Integration for Feedback Pusher

This adapter transforms feedback from the standard Feedback Pusher payload into Quickbase records.

## Standard Feedback Payload

All feedback arrives in this format (see [General Feedback API](/implementations/General/)):

```javascript
{
  title: string,
  type: 'bug' | 'idea' | 'feedback',
  description: string,
  email?: string,
  metadata?: { url, userAgent, timestamp, ... }
}
```

Your backend adapter (e.g., `/api/feedback/quickbase`) receives this and transforms it into Quickbase records.

## Quickbase JavaScript Client

A simple, lightweight JavaScript client for interacting with the Quickbase API.

## Setup

### 1. Get Your Credentials

- **Realm**: Your Quickbase realm URL (e.g., `company.quickbase.com`)
- **App ID**: The ID of your Quickbase application
- **API Token**: Generate from Quickbase Account Settings > My Preferences > API Tokens

### 2. Initialize the Client

```javascript
const QuickbaseClient = require('./quickbaseClient');

const qb = new QuickbaseClient({
  realm: 'your-realm.quickbase.com',
  appId: 'your_app_id',
  apiToken: 'your_api_token'
});
```

## API Methods

### `getRecords(tableId, options)`
Query records from a table.

```javascript
const records = await qb.getRecords('tableId123', {
  limit: 10,
  skip: 0,
  where: '{fieldId.EX.value}'  // Optional WHERE clause
});
```

### `getRecord(tableId, recordId)`
Get a single record by ID.

```javascript
const record = await qb.getRecord('tableId123', 'recordId456');
```

### `createRecord(tableId, fields)`
Create a new record.

```javascript
const result = await qb.createRecord('tableId123', {
  1: { value: 'John Doe' },
  2: { value: 'john@example.com' }
});
```

### `updateRecord(tableId, recordId, fields)`
Update an existing record.

```javascript
const result = await qb.updateRecord('tableId123', 'recordId456', {
  2: { value: 'newemail@example.com' }
});
```

### `deleteRecord(tableId, recordId)`
Delete a record.

```javascript
const result = await qb.deleteRecord('tableId123', 'recordId456');
```

### `getFields(tableId)`
Get the schema (all fields) for a table.

```javascript
const fields = await qb.getFields('tableId123');
```

### `getTableInfo(tableId)`
Get detailed information about a table.

```javascript
const info = await qb.getTableInfo('tableId123');
```

## Field IDs

In Quickbase, fields are referenced by numeric IDs. To find field IDs:
1. Go to the table in Quickbase
2. Click "Customize" → "Manage fields"
3. Look at the field ID in the list (e.g., field 3 is typically the Record ID)

## Error Handling

All methods throw errors if the request fails. Wrap calls in try-catch blocks:

```javascript
try {
  const records = await qb.getRecords('tableId123');
} catch (error) {
  console.error('Failed to fetch records:', error);
}
```

## Query Syntax (WHERE clauses)

Quickbase uses a specific query syntax. Examples:

- Exact match: `{1.EX.value}` (field 1 equals "value")
- Contains: `{1.CT.substring}` (field 1 contains "substring")
- Greater than: `{1.GT.100}` (field 1 > 100)
- Less than: `{1.LT.100}` (field 1 < 100)
- AND conditions: `{1.EX.value}AND{2.EX.other}`
- OR conditions: `{1.EX.value}OR{2.EX.other}`

[Quickbase API Query Documentation](https://developer.quickbase.com/reference/query-where-clause)

## Environment Variables

For production, store credentials in environment variables:

```javascript
const qb = new QuickbaseClient({
  realm: process.env.QB_REALM,
  appId: process.env.QB_APP_ID,
  apiToken: process.env.QB_API_TOKEN
});
```

## Browser Usage

The client uses the Fetch API and works in modern browsers. For Node.js, ensure you have Node v18+ or use a fetch polyfill.

## Backend Integration Example

Transform the standard Feedback Pusher payload into a Quickbase record:

```javascript
const QuickbaseClient = require('./quickbaseClient');

const qb = new QuickbaseClient({
  realm: process.env.QB_REALM,
  appId: process.env.QB_APP_ID,
  apiToken: process.env.QB_API_TOKEN
});

// POST /api/feedback/quickbase
app.post('/api/feedback/quickbase', async (req, res) => {
  const { title, type, description, email, metadata } = req.body;

  try {
    // Transform standard payload to Quickbase fields
    const record = await qb.createRecord('tblXXXXXXXXXXXXXX', {
      1: { value: title },                    // Title field
      2: { value: description },              // Description field
      3: { value: type },                     // Type field (bug/idea/feedback)
      4: { value: email || '' },              // Contact email
      5: { value: metadata.url || '' },       // Source URL
      6: { value: metadata.userAgent || '' }, // Browser info
      7: { value: metadata.timestamp }        // Submission time
    });

    res.json({ 
      success: true, 
      recordId: record.id,
      message: 'Feedback recorded in Quickbase'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});
```

Replace `tblXXXXXXXXXXXXXX` with your actual Quickbase table ID, and adjust field numbers (1, 2, 3, etc.) to match your table schema.

## Resources

- [Quickbase API Documentation](https://developer.quickbase.com/)
- [Quickbase API Query Syntax](https://developer.quickbase.com/reference/query-where-clause)
- [Field Types Reference](https://developer.quickbase.com/reference/field-types)
- [General Feedback API](/implementations/General/) — Standard payload contract
