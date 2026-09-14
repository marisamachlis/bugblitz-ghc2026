// ============================================================================
// ℹ️ WORKSHOP SETUP: Mock fallback for Supabase backend.
// ⚠️ DO NOT LOOK HERE FOR BUGS: This file is part of the workshop setup, not the exercise challenges!
// ============================================================================
import { spawn } from 'node:child_process';
import { createConnection } from 'node:net';

const ng = process.platform === 'win32' ? 'ng.cmd' : './node_modules/.bin/ng';
// Open the UI port first so StackBlitz initially previews Angular, not the API.
const app = spawn(ng, ['serve', '--port', '4200'], { stdio: 'inherit' });
let api;

function waitForApp(port = 4200, attempts = 2400) {
  return new Promise((resolve, reject) => {
    const tryConnect = remaining => {
      if (stopped) { resolve(); return; }
      const socket = createConnection({ port, host: 'localhost' }, () => {
        socket.end();
        resolve();
      });
      socket.on('error', () => {
        if (remaining <= 0) reject(new Error(`Angular did not start on ${port}`));
        else setTimeout(() => tryConnect(remaining - 1), 50);
      });
    };
    tryConnect(attempts);
  });
}

let stopped = false;
const stop = () => { stopped = true; api?.kill(); app.kill(); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);

app.on('exit', code => { api?.kill(); process.exit(code ?? 0); });
app.on('error', error => { console.error(error.message); stop(); process.exit(1); });
try {
  await waitForApp();
  if (!stopped) {
    api = spawn(process.execPath, ['workshop/mock-api-server.mjs'], { stdio: 'inherit' });
  }
} catch (error) {
  console.error(error.message);
  stop();
  process.exitCode = 1;
}
