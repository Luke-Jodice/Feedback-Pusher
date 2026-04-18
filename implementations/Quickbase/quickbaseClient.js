/**
 * Quickbase API Client Boilerplate
 *
 * Usage:
 * 1. Set your Quickbase credentials in the config object
 * 2. Use the client methods to interact with Quickbase API
 */

class QuickbaseClient {
  constructor(config) {
    // Config structure:
    // {
    //   realm: 'your-realm.quickbase.com',
    //   appId: 'your_app_id',
    //   apiToken: 'your_api_token'
    // }
    this.realm = config.realm;
    this.appId = config.appId;
    this.apiToken = config.apiToken;
    this.baseUrl = `https://${config.realm}/api/v1`;
  }

  /**
   * Make a request to Quickbase API
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
   * @param {string} endpoint - API endpoint path (e.g., '/records')
   * @param {object} body - Request body (optional)
   * @returns {Promise<object>} - API response
   */
  async request(method, endpoint, body = null) {
    const url = `${this.baseUrl}${endpoint}`;

    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        'QB-Realm-Hostname': this.realm
      }
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Quickbase API Error: ${response.status} - ${JSON.stringify(error)}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Request failed: ${method} ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * Get records from a table
   * @param {string} tableId - The table ID
   * @param {object} options - Query options (optional)
   * @returns {Promise<array>} - Array of records
   */
  async getRecords(tableId, options = {}) {
    const body = {
      from: tableId,
      select: options.select || undefined,
      where: options.where || undefined,
      limit: options.limit || 100,
      skip: options.skip || 0
    };

    // Remove undefined values
    Object.keys(body).forEach(key => body[key] === undefined && delete body[key]);

    const response = await this.request('POST', '/records/query', body);
    return response.data || [];
  }

  /**
   * Get a single record by ID
   * @param {string} tableId - The table ID
   * @param {string} recordId - The record ID
   * @returns {Promise<object>} - Record data
   */
  async getRecord(tableId, recordId) {
    const response = await this.request('GET', `/records/${recordId}?tableId=${tableId}`);
    return response.data || response;
  }

  /**
   * Create a new record
   * @param {string} tableId - The table ID
   * @param {object} fields - Field data to insert
   * @returns {Promise<object>} - Created record info
   */
  async createRecord(tableId, fields) {
    const body = {
      to: tableId,
      data: [
        {
          fields: fields
        }
      ]
    };

    const response = await this.request('POST', '/records', body);
    return response.data?.[0] || response;
  }

  /**
   * Update a record
   * @param {string} tableId - The table ID
   * @param {string} recordId - The record ID
   * @param {object} fields - Field data to update
   * @returns {Promise<object>} - Update response
   */
  async updateRecord(tableId, recordId, fields) {
    const body = {
      to: tableId,
      data: [
        {
          id: recordId,
          fields: fields
        }
      ]
    };

    const response = await this.request('PUT', '/records', body);
    return response.data?.[0] || response;
  }

  /**
   * Delete a record
   * @param {string} tableId - The table ID
   * @param {string} recordId - The record ID
   * @returns {Promise<object>} - Delete response
   */
  async deleteRecord(tableId, recordId) {
    const body = {
      from: tableId,
      where: `{3.EX.${recordId}}`
    };

    return await this.request('DELETE', '/records', body);
  }

  /**
   * Get table information
   * @param {string} tableId - The table ID
   * @returns {Promise<object>} - Table schema and info
   */
  async getTableInfo(tableId) {
    return await this.request('GET', `/tables/${tableId}`);
  }

  /**
   * Get all fields in a table
   * @param {string} tableId - The table ID
   * @returns {Promise<array>} - Array of fields
   */
  async getFields(tableId) {
    const response = await this.request('GET', `/tables/${tableId}/fields`);
    return response.data || [];
  }
}

// Export for Node.js/CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuickbaseClient;
}
