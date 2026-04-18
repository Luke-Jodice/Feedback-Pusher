import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();
const port = 3000;

app.use('/feedback/*', cors({
  origin: '*', 
  allowMethods: ['POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}))

app.use('/*', serveStatic({ root: './' }));

app.get('/', (c) => c.redirect('/generic-component.html'));

// Generic route to handle feedback for any owner and repo
app.post('/feedback/:owner/:repo', async (c) => {
  const { owner, repo } = c.req.param();
  try {
    const { title, body, labels } = await c.req.json();
    
    const token = process.env.GITHUB_API_KEY;

    if (!token) {
      console.error("Missing GITHUB_API_KEY environment variable");
      return c.json({ error: 'Server configuration error: Missing API Key' }, 500);
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
        'User-Agent': 'GitHub-Feedback-Tool'
      },
      body: JSON.stringify({ 
        title: title || 'No Title Provided', 
        body: body || 'No Description Provided', 
        labels: labels || ["feedback"] 
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return c.json({ success: true, issue: data });
    } else {
      const errorData = await response.json();
      return c.json({ error: 'GitHub API error', details: errorData }, response.status);
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

if (process.env.NODE_ENV !== 'production' && typeof Bun === 'undefined') {
  const { serve } = await import('@hono/node-server');
  serve({
    fetch: app.fetch,
    port: port
  }, (info) => {
    console.log(`🚀 Generic Feedback Server running at http://localhost:${info.port}`);
  });
}

export default app;
