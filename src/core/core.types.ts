export interface Cell extends Array<number> { }

export interface Configuration extends Array<Cell> { }

export type Uint32 = number & { __uint32__: void };

export type Vec2u = Uint32Array & { readonly __vec2u__: unique symbol, x: Uint32, y: Uint32 };
export type Vec2f = Float32Array & { x: number; y: number };
