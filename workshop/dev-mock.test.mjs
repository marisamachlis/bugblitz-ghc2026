// ============================================================================
// ℹ️ WORKSHOP SETUP: Mock fallback for Supabase backend.
// ⚠️ DO NOT LOOK HERE FOR BUGS: This file is part of the workshop setup, not the exercise challenges!
// ============================================================================
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';

const source = (await readFile(new URL('./dev-mock.mjs', import.meta.url), 'utf8'))
  .replace(/^import .*;\n/gm, '');

for (const cancel of [false, true]) {
  test(cancel ? 'stopping during compilation does not start the API' : 'API starts only after Angular opens port 4200', async () => {
    const children = [];
    const processStub = new EventEmitter();
    Object.assign(processStub, { platform: 'linux', execPath: '/node', exit: () => {} });
    let connected;
    const context = {
      process: processStub, console, setTimeout,
      spawn: (command, args) => {
        const child = new EventEmitter();
        Object.assign(child, { command, args, killed: false, kill() { this.killed = true; } });
        children.push(child);
        return child;
      },
      createConnection: (options, callback) => {
        assert.equal(options.port, 4200);
        assert.equal(options.host, 'localhost');
        connected = callback;
        const socket = new EventEmitter();
        socket.end = () => {};
        return socket;
      },
    };
    const completion = vm.runInNewContext(`(async () => {${source}\n})()`, context);
    assert.equal(children.length, 1);
    assert.deepEqual(Array.from(children[0].args), ['serve', '--port', '4200']);
    if (cancel) processStub.emit('SIGINT');
    connected();
    await completion;
    assert.equal(children.length, cancel ? 1 : 2);
    if (!cancel) {
      assert.equal(children[1].args[0], 'workshop/mock-api-server.mjs');
      processStub.emit('SIGTERM');
      assert.equal(children[1].killed, true);
    }
    assert.equal(children[0].killed, true);
  });
}
