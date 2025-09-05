import test from 'node:test';
import assert from 'node:assert/strict';
import { getDir } from '../utils/direction.js';

const pt = (ang) => [Math.sin((ang * Math.PI) / 180), Math.cos((ang * Math.PI) / 180)];

test('30° ⇒ NE and 120° ⇒ SE', () => {
  assert.equal(getDir([0, 0], pt(30)), 'NE');
  assert.equal(getDir([0, 0], pt(120)), 'SE');
});

test('boundary between NE and E around 67.5°', () => {
  assert.equal(getDir([0, 0], pt(66)), 'NE');
  assert.equal(getDir([0, 0], pt(68)), 'E');
});
