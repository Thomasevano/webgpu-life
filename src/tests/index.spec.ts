import { describe, it, expect } from 'vitest';
import { cellIndex } from '../core/core';
import { vec2u, vec2f } from '../core/utils';

describe('cellIndex', () => {
  it('should return the cell index', () => {
    // Given
    const cell = vec2u(1, 2);
    const grid = vec2f(3, 3);

    // When
    const index = cellIndex(cell, grid);

    // Then
    expect(index).toBe(7);
  });
});
