// ============================================
// APPROACH 1: Using Jira REST API v3 with Fetch
// ============================================

async function createJiraIssueWithFetch(issueData) {
  const jiraUrl = 'https://your-domain.atlassian.net';
  const apiToken = process.env.JIRA_API_TOKEN; // Store securely
  const email = process.env.JIRA_EMAIL;

  try {
    const response = await fetch(`${jiraUrl}/rest/api/3/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          project: { key: issueData.projectKey }, // e.g., 'PROJ'
          summary: issueData.summary,
          description: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: issueData.description }],
              },
            ],
          },
          issuetype: { name: issueData.issueType }, // e.g., 'Bug', 'Story', 'Task'
          // Add more fields as needed:
          // assignee: { id: 'user-id' },
          // priority: { name: 'High' },
          // labels: ['label1', 'label2'],
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create issue: ${response.statusText}`);
    }

    const issue = await response.json();
    console.log(`Issue created: ${issue.key}`);
    return issue;
  } catch (error) {
    console.error('Error creating Jira issue:', error);
    throw error;
  }
}

// Usage
/*
createJiraIssueWithFetch({
  projectKey: 'PROJ',
  summary: 'Fix login bug',
  description: 'Users cannot log in with SSO',
  issueType: 'Bug',
});
*/


// ============================================
// APPROACH 2: Using jira.js SDK (Recommended)
// ============================================
// Install: npm install jira.js

const { Version3Client } = require('jira.js');

async function createJiraIssueWithSDK(issueData) {
  const client = new Version3Client({
    host: 'https://your-domain.atlassian.net',
    authentication: {
      basic: {
        email: process.env.JIRA_EMAIL,
        apiToken: process.env.JIRA_API_TOKEN,
      },
    },
  });

  try {
    const issue = await client.issues.createIssue({
      fields: {
        project: { key: issueData.projectKey },
        summary: issueData.summary,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: issueData.description }],
            },
          ],
        },
        issuetype: { name: issueData.issueType },
        // Add more fields as needed:
        // assignee: { id: 'user-id' },
        // priority: { name: 'High' },
        // labels: ['label1', 'label2'],
      },
    });

    console.log(`Issue created: ${issue.key}`);
    return issue;
  } catch (error) {
    console.error('Error creating Jira issue:', error);
    throw error;
  }
}

// Usage
/*
createJiraIssueWithSDK({
  projectKey: 'PROJ',
  summary: 'Fix login bug',
  description: 'Users cannot log in with SSO',
  issueType: 'Bug',
});
*/


// ============================================
// SETUP INSTRUCTIONS
// ============================================
/*
1. Get your API token:
   - Go to https://id.atlassian.com/manage-profile/security/api-tokens
   - Click "Create API token"
   - Copy the token

2. Set environment variables:
   export JIRA_EMAIL="your-email@example.com"
   export JIRA_API_TOKEN="your-api-token"

3. Update the Jira URL:
   - Replace "your-domain" with your actual Jira domain

4. Common issue types:
   - Bug
   - Story
   - Task
   - Epic
   - Sub-task

5. For SDK approach, install the package:
   npm install jira.js
*/
