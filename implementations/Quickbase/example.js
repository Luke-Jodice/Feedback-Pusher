/**
 * Example usage of QuickbaseClient
 */

const QuickbaseClient = require('./quickbaseClient');

// Initialize the client with your credentials
const qb = new QuickbaseClient({
  realm: 'your-realm.quickbase.com',
  appId: 'your_app_id',
  apiToken: 'your_api_token'
});

// Example 1: Get records from a table
async function getRecordsExample() {
  try {
    const records = await qb.getRecords('tableId123', {
      limit: 10,
      where: '{fieldId1.EX.value}' // Optional: add a WHERE clause
    });
    console.log('Records:', records);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 2: Get a single record
async function getRecordExample() {
  try {
    const record = await qb.getRecord('tableId123', 'recordId456');
    console.log('Record:', record);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 3: Create a record
async function createRecordExample() {
  try {
    const newRecord = await qb.createRecord('tableId123', {
      1: { value: 'John Doe' },      // Name field
      2: { value: 'john@example.com' } // Email field
    });
    console.log('Created record:', newRecord);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 4: Update a record
async function updateRecordExample() {
  try {
    const updated = await qb.updateRecord('tableId123', 'recordId456', {
      2: { value: 'newemail@example.com' }
    });
    console.log('Updated record:', updated);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 5: Delete a record
async function deleteRecordExample() {
  try {
    const result = await qb.deleteRecord('tableId123', 'recordId456');
    console.log('Delete result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 6: Get table schema
async function getTableSchemaExample() {
  try {
    const fields = await qb.getFields('tableId123');
    console.log('Table fields:', fields);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run examples (uncomment to test)
// getRecordsExample();
// getRecordExample();
// createRecordExample();
// updateRecordExample();
// deleteRecordExample();
// getTableSchemaExample();
