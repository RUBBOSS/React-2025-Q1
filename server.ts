import express from 'express';
import { renderToPipeableStream } from 'react-dom/server';
import { render } from './src/entry-server';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets
app.use(express.static('public'));
app.use(express.static('dist/client'));

// Handle all routes
app.get('*', async (req, res) => {
  try {
    const html = await render(new Request(req.url));
    
    const { pipe } = renderToPipeableStream(html, {
      bootstrapScripts: ['/client.js'],
      onShellReady() {
        res.setHeader('Content-Type', 'text/html');
        res.write('<!DOCTYPE html>');
        pipe(res);
      },
      onError(error) {
        console.error(error);
        res.status(500).send('<!DOCTYPE html><html><body><h1>Server Error</h1></body></html>');
      }
    });
  } catch (error) {
    console.error('Rendering error:', error);
    res.status(500).send('<!DOCTYPE html><html><body><h1>Server Error</h1></body></html>');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
