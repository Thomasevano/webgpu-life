import { Uint32, Vec2u, Vec2f } from './core.types';

export function asUint32(value: number): Uint32 {
  return (value >>> 0) as Uint32;
}

export function vec2u(x: number | Uint32, y: number | Uint32): Vec2u {
  const array = new Uint32Array([
    asUint32(x),
    asUint32(y)
  ]) as Vec2u;

  Object.defineProperties(array, {
    x: { get: () => array[0] },
    y: { get: () => array[1] },
  });

  return array;
}

export function vec2f(x: number, y: number): Vec2f {
  const array = new Float32Array([x, y]) as Vec2f;

  Object.defineProperties(array, {
    x: { get: () => array[0] },
    y: { get: () => array[1] },
  });

  return array;
}