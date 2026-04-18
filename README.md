# Feedback Tool

This repository is a tool designed to assist with the creation and use of feedback across different places. It provides a modular feedback component that can be easily integrated into any web application to collect user feedback, bug reports, or feature requests and push them directly to various destinations. 

Currently you are able to push feedback to GitHub Repos using Issues.

I am currently in the process of creating example components for the following integrations to helep with future projects that I am looking to setup:
- Quickbase
- Jira

## Features

- **Ready-to-use Feedback Modal:** A pre-styled, accessible modal component for collecting user input.
- **Generic GitHub Integration:** Easily target any repository by owner and name.
- **Flexible & Extendable:** Designed to be adapted for different feedback destinations.
- **Lightweight Backend:** Built with [Hono](https://hono.dev/) for high performance and easy deployment.

## Project Structure

- `github/generic-index.js`: **(Recommended)** A generic backend server that accepts `:owner` and `:repo` parameters.
- `github/generic-component.html`: **(Recommended)** A generic frontend component with a simple configuration object.
- `github/index.js`: A legacy implementation tied to a specific user.
- `github/component.html`: A legacy frontend implementation.
- `styles.css`: Base styling for the feedback component.

## Setup

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js
- A GitHub Personal Access Token with `repo` scope.

### Environment Variables

Create a `.env` file in the root directory:

```env
GITHUB_API_KEY=your_github_personal_access_token
```

### Installation

```bash
bun install
```

## Usage (Generic Version)

### 1. Start the Server

Run the generic backend server:

```bash
bun github/generic-index.js
```

### 2. Configure the Component

Open `github/generic-component.html` and update the `CONFIG` object with your target repository details:

```javascript
const CONFIG = {
    owner: 'YOUR_GITHUB_USERNAME',
    repo: 'YOUR_REPO_NAME',
    endpoint: '/feedback'
};
```

### 3. Integrate

Include the component in your project. The component will now dynamically send feedback to:
`POST /feedback/:owner/:repo`

## Payload Format

The backend expects the following JSON payload:

```json
{
  "title": "Feedback Title",
  "body": "Feedback Description and metadata",
  "labels": ["feedback"]
}
```

## How it Works

1. **User Interaction:** The user clicks the "See a Bug?" button.
2. **Data Collection:** A modal opens for input (Title, Description, Type, Email).
3. **Backend Processing:** The data is sent to the Hono backend via the generic route.
4. **Issue Creation:** The backend uses the GitHub API to create an issue in the specified repository using your `GITHUB_API_KEY`.

---
*Assisting with the flow of feedback from your users to your development workflow.*
