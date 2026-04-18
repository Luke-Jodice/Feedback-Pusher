# General Feedback API

A vague, backend-agnostic feedback submission interface. This module defines the **standard feedback payload contract** that all Feedback Pusher backends accept, regardless of their target system (GitHub, Jira, Quickbase, etc.).

## Philosophy

The frontend doesn't know about your backend's destination. It submits feedback in a standard format. Your backend transforms it into whatever system you're using.

## Standard Feedback Payload

All backends accept this structure:

```javascript
{
  title: string,           // Required. Short summary (e.g., "Save button broken")
  type: 'bug' | 'idea' | 'feedback',  // Required. Category
  description: string,     // Required. Detailed explanation or steps
  email?: string,          // Optional. User's contact info
  metadata?: {             // Optional. Auto-captured + custom fields
    url?: string,          // Page where feedback originated
    userAgent?: string,    // Browser info
    timestamp?: string,    // ISO 8601 timestamp
    viewport?: string,     // Screen resolution (e.g., "1440×900")
    referrer?: string,     // Previous page
    custom?: object        // Any additional fields
  }
}
```

## Browser Usage

```javascript
import FeedbackClient from './feedback-api.js';

const feedback = new FeedbackClient({
  endpoint: '/feedback',  // Your backend endpoint
  includeMetadata: true   // Auto-capture browser info (default: true)
});

try {
  await feedback.submit({
    title: 'Login page slow',
    type: 'bug',
    description: 'Takes 5 seconds to load after clicking submit',
    email: 'user@example.com'
  });
  console.log('Feedback submitted!');
} catch (error) {
  console.error('Submission failed:', error.message);
}
```

## Backend Implementation Pattern

Each backend (GitHub, Jira, Quickbase, etc.) receives the standard payload and transforms it:

```
Browser POST /feedback
    ↓
Standard Payload
    ↓
Backend Adapter (github/index.js, jira/index.js, etc.)
    ↓
Transform to target system format
    ↓
Create Issue/Ticket/Record
```

### Example: GitHub Adapter

```javascript
// Receives standard payload, creates GitHub Issue
app.post('/feedback/:owner/:repo', (req, res) => {
  const { title, description, type, metadata } = req.body;
  
  // Transform to GitHub Issue format
  const issue = {
    title,
    body: `${description}\n\n---\n_Browser: ${metadata.userAgent}_`,
    labels: [type]
  };
  
  // Create issue via GitHub API...
});
```

### Example: Quickbase Adapter

```javascript
// Receives standard payload, creates Quickbase Record
app.post('/feedback/quickbase', (req, res) => {
  const { title, description, type, email } = req.body;
  
  // Transform to Quickbase Record format
  const record = {
    1: { value: title },           // Field 1: Title
    2: { value: description },     // Field 2: Description
    3: { value: type },            // Field 3: Type
    4: { value: email }            // Field 4: Contact Email
  };
  
  // Create record via Quickbase API...
});
```

## Validation

The client validates before sending:
- `title` must be a non-empty string
- `type` must be one of: `bug`, `idea`, `feedback`
- `description` must be a non-empty string
- `email` (if provided) must be a string

The backend should validate again before processing.

## Error Handling

```javascript
try {
  await feedback.submit(payload);
} catch (error) {
  if (error.message.includes('title is required')) {
    // Handle validation error
  } else if (error.message.includes('Backend returned')) {
    // Handle network/backend error
  }
}
```

## Custom Headers

Pass additional headers (auth tokens, API keys, etc.):

```javascript
const feedback = new FeedbackClient({
  endpoint: '/feedback',
  headers: {
    'Authorization': 'Bearer my-token',
    'X-App-Version': '1.0.0'
  }
});
```

## Metadata Control

Disable auto-metadata capture if needed:

```javascript
const feedback = new FeedbackClient({
  endpoint: '/feedback',
  includeMetadata: false  // Skip browser info capture
});
```

Or override specific fields:

```javascript
await feedback.submit({
  title: 'Bug report',
  type: 'bug',
  description: 'Found an issue',
  metadata: {
    custom: {
      userId: '12345',
      plan: 'pro'
    }
  }
});
```

## Integration Examples

- **[GitHub](/implementations/github/)** — Creates Issues in any public/private repo
- **[Jira](/implementations/jira/)** — Creates Jira tickets with custom field mapping
- **[Quickbase](/implementations/quickbase/)** — Inserts records into any Quickbase table

Each adapter accepts the standard payload and transforms it for its target system.
