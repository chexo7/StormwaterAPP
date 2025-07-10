import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

const SERVER_URL = 'http://localhost:3001';

async function startServer() {
  const proc = spawn('node', ['server.js']);
  // wait briefly for server to start
  await setTimeout(1000);
  return proc;
}

test('intersect endpoint returns intersection', async () => {
  const server = await startServer();
  try {
    const response = await fetch(`${SERVER_URL}/api/intersect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        poly1: { type: 'Polygon', coordinates: [[[0,0],[1,0],[1,1],[0,1],[0,0]]] },
        poly2: { type: 'Polygon', coordinates: [[[0.5,0.5],[1.5,0.5],[1.5,1.5],[0.5,1.5],[0.5,0.5]]] }
      })
    });
    assert.strictEqual(response.status, 200);
    const data = await response.json();
    assert.ok(data);
    assert.strictEqual(data.type, 'Feature');
  } finally {
    server.kill();
    await setTimeout(100);
  }
});

test('intersect endpoint validates polygons', async () => {
  const server = await startServer();
  try {
    const response = await fetch(`${SERVER_URL}/api/intersect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ poly1: null, poly2: null })
    });
    assert.strictEqual(response.status, 400);
  } finally {
    server.kill();
    await setTimeout(100);
  }
});
