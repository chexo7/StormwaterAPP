import test from 'node:test';
import assert from 'node:assert/strict';
import { getDir } from '../utils/direction.js';

const origin = [0, 0];
const dest = (deg) => {
  const rad = deg * Math.PI / 180;
  // 0° is north, positive clockwise
  return [Math.sin(rad), Math.cos(rad)];
};

test('bearing quantization to 8 directions', () => {
  assert.equal(getDir(origin, dest(30)), 'NE');
  assert.equal(getDir(origin, dest(120)), 'SE');
  assert.equal(getDir(origin, dest(210)), 'SW');
  assert.equal(getDir(origin, dest(300)), 'NW');
});

test('direction boundary near E/NE', () => {
  assert.equal(getDir(origin, dest(67)), 'NE');
  assert.equal(getDir(origin, dest(68)), 'E');
});
