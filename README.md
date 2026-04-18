# Feedback Pusher

A lightweight, backend-agnostic feedback collection system. Drop a modal into any web app to collect user feedback, bug reports, or feature requests — then route them to GitHub Issues, Jira, Quickbase, or your own destination.

The frontend uses a **standard feedback payload** that any backend adapter can consume and transform for its target system. No destination-specific code in the browser.

**Currently shipping:**
- ✓ GitHub Issues
- 🚧 Jira (in progress)
- 🚧 Quickbase (in progress)

## Features

- **Ready-to-use Feedback Modal:** A pre-styled, accessible modal component for collecting user input.
- **Backend-Agnostic:** Universal frontend, pluggable backends. Same payload format for GitHub, Jira, Quickbase, or custom destinations.
- **Standard Payload Contract:** All backends accept the same feedback format. Your backend decides where it goes.
- **Lightweight Backend:** Built with [Hono](https://hono.dev/) for high performance and easy deployment.
- **Zero browser dependencies:** Works with any frontend stack — React, Vue, Svelte, or vanilla JS.

## Project Structure

```
.
├── index.html                          # Landing page & live demo
├── implementations/
│   ├── General/
│   │   ├── feedback-api.js            # Standard feedback client (browser)
│   │   └── README.md                  # Payload spec & integration guide
│   ├── github/
│   │   ├── index.js                   # GitHub backend adapter
│   │   ├── component.html             # Example HTML integration
│   │   └── package.json
│   ├── Jira/
│   │   ├── create-issue-boilerplate.js
│   │   └── (in progress)
│   └── Quickbase/
│       ├── quickbaseClient.js
│       ├── example.js
│       └── README.md
└── package.json
```

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js
- A GitHub Personal Access Token with `repo` scope (for GitHub backend)

### Installation

```bash
bun install
```

### 1. Choose Your Backend

Start the backend for your target system. Example with GitHub:

```bash
bun implementations/github/index.js
```

The server will listen on `:3000` by default.

### 2. Add Environment Variables

Create a `.env` file in the root with your backend credentials:

```env
# GitHub backend
GITHUB_API_KEY=ghp_xxxxxxxxxxxxxxxxxxxx

# Or Quickbase backend
QB_REALM=company.quickbase.com
QB_APP_ID=your_app_id
QB_API_TOKEN=your_token
```

### 3. Integrate the Frontend

Use the standard feedback client in your app:

```javascript
import FeedbackClient from './implementations/General/feedback-api.js';

const feedback = new FeedbackClient({
  endpoint: '/feedback',
  includeMetadata: true  // Auto-capture browser info
});

// Submit feedback from anywhere
await feedback.submit({
  title: 'Save button broken',
  type: 'bug',
  description: 'Fails on checkout page',
  email: 'user@example.com'
});
```

## Standard Payload Format

All backends accept this structure:

```javascript
{
  title: string,                    // Required. Short summary
  type: 'bug' | 'idea' | 'feedback', // Required. Category
  description: string,              // Required. Detailed explanation
  email?: string,                   // Optional. User contact info
  metadata?: {                      // Optional. Auto-captured browser data
    url?: string,                   // Page origin
    userAgent?: string,             // Browser info
    timestamp?: string,             // ISO 8601
    viewport?: string,              // Resolution
    custom?: object                 // Your custom fields
  }
}
```

## How It Works

1. **User submits feedback** via the modal (or custom form)
2. **Standard payload** is POSTed to your backend endpoint
3. **Backend adapter** (GitHub, Jira, Quickbase, etc.) receives the payload
4. **Transformation** happens server-side into target system format
5. **Issue/Ticket/Record** is created with appropriate metadata

```
Browser ──POST /feedback──> Backend Adapter
                               ↓
                          Transform payload
                               ↓
                         Create GitHub Issue
                         Create Jira Ticket
                         Create QB Record
                         (or custom destination)
```

## Using Different Backends

### GitHub
See `/implementations/github/` for a complete example that creates issues in any repo.

### Jira
See `/implementations/Jira/` for Jira cloud integration (in progress).

### Quickbase
See `/implementations/Quickbase/` for Quickbase record insertion (in progress).

### Custom Backend
Create your own adapter that accepts the standard payload and transforms it for your destination.

## View the Demo

Open `index.html` in a browser to see the landing page and live demo modal (demo mode doesn't submit anywhere).

---
*Assisting with the flow of feedback from your users to your development workflow.*
