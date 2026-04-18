/**
 * Generic Feedback API - Agnostic submission module
 *
 * This module provides a standard interface for submitting user feedback
 * to any backend destination (GitHub, Jira, Quickbase, etc.)
 *
 * The backend implementation is responsible for transforming the standard
 * feedback payload into the target system's format.
 */

/**
 * Standard feedback payload structure
 * @typedef {Object} FeedbackPayload
 * @property {string} title - Short summary of the feedback
 * @property {'bug' | 'idea' | 'feedback'} type - Category of feedback
 * @property {string} description - Detailed description or steps to reproduce
 * @property {string} [email] - Optional email for follow-up
 * @property {Object} [metadata] - Optional metadata (browser info, URL, etc)
 * @property {string} [metadata.url] - Page URL where feedback originated
 * @property {string} [metadata.userAgent] - Browser user agent string
 * @property {string} [metadata.timestamp] - ISO timestamp
 * @property {Object} [metadata.custom] - Additional custom fields
 */

class FeedbackClient {
  /**
   * Initialize feedback client
   * @param {Object} config
   * @param {string} config.endpoint - Backend endpoint URL (e.g., '/feedback' or 'https://api.example.com/feedback')
   * @param {Object} [config.headers] - Additional headers to send with requests
   * @param {boolean} [config.includeMetadata] - Auto-capture browser metadata (default: true)
   */
  constructor(config) {
    this.endpoint = config.endpoint;
    this.headers = config.headers || {};
    this.includeMetadata = config.includeMetadata !== false;
  }

  /**
   * Capture browser metadata
   * @private
   * @returns {Object} Metadata object
   */
  captureMetadata() {
    if (!this.includeMetadata) return {};

    return {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      viewport: `${window.innerWidth}×${window.innerHeight}`,
      referrer: document.referrer || undefined
    };
  }

  /**
   * Validate feedback payload
   * @private
   * @param {FeedbackPayload} payload
   * @throws {Error} If validation fails
   */
  validate(payload) {
    if (!payload.title || typeof payload.title !== 'string') {
      throw new Error('Feedback title is required and must be a string');
    }
    if (!payload.type || !['bug', 'idea', 'feedback'].includes(payload.type)) {
      throw new Error('Feedback type must be one of: bug, idea, feedback');
    }
    if (!payload.description || typeof payload.description !== 'string') {
      throw new Error('Feedback description is required and must be a string');
    }
    if (payload.email && typeof payload.email !== 'string') {
      throw new Error('Email must be a valid string');
    }
  }

  /**
   * Submit feedback to the backend
   * @param {FeedbackPayload} feedback
   * @returns {Promise<Object>} Response from backend
   * @throws {Error} If submission fails
   */
  async submit(feedback) {
    // Validate before sending
    this.validate(feedback);

    // Build payload with metadata if enabled
    const payload = {
      ...feedback,
      metadata: {
        ...this.captureMetadata(),
        ...feedback.metadata
      }
    };

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.headers
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Backend returned ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to submit feedback: ${error.message}`);
    }
  }
}

// Export for use in browsers and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FeedbackClient;
}
