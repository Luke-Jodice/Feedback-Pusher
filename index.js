import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/bun';
import fs from 'node:fs/promises';

const app = new Hono();

// // Enable CORS for feedback endpoints
// app.use('/feedback/*', cors({
//   origin: '*',
//   allowMethods: ['POST', 'OPTIONS'],
//   allowHeaders: ['Content-Type'],
// }));

// Serve index.html at the root endpoint
app.get('/', async (c) => {
  try {
    const html = await fs.readFile('./index.html', 'utf-8');
    return c.html(html);
  } catch (err) {
    return c.text('Landing page not found', 404);
  }
});

export default app;

//Commenting out Endpoint, as would be part of what will eventually be what is added in the folder for project

// Generic route to handle feedback for any owner and repo
// app.post('/feedback/:owner/:repo', async (c) => {
//   const { owner, repo } = c.req.param();
//   try {
//     const bodyText = await c.req.text();
//     let jsonPayload;
//     try {
//       jsonPayload = JSON.parse(bodyText);
//     } catch (e) {
//       return c.json({ error: 'Invalid JSON payload' }, 400);
//     }

//     const { title, body, labels } = jsonPayload;
//     const token = process.env.GITHUB_API_KEY;

//     if (!token) {
//       console.error("Missing GITHUB_API_KEY environment variable");
//       return c.json({ error: 'Server configuration error: Missing API Key' }, 500);
//     }

//     const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/vnd.github+json',
//         'X-GitHub-Api-Version': '2022-11-28',
//         'Content-Type': 'application/json',
//         'User-Agent': 'GitHub-Feedback-Tool'
//       },
//       body: JSON.stringify({ 
//         title: title || 'No Title Provided', 
//         body: body || 'No Description Provided', 
//         labels: labels || ["feedback"] 
//       }),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       return c.json({ success: true, issue: data });
//     } else {
//       const errorData = await response.json();
//       return c.json({ error: 'GitHub API error', details: errorData }, response.status);
//     }
//   } catch (error) {
//     console.error('Error submitting feedback:', error);
//     return c.json({ error: 'Internal Server Error' }, 500);
//   }
// });

