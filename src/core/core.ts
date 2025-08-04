import { Uint32, Vec2u, Vec2f } from './core.types';
import { asUint32 } from './utils';

export function cellIndex(cell: Vec2u, grid: Vec2f): Uint32 {
  const gridX = asUint32(grid.x);
  const gridY = asUint32(grid.y);

  const ModY = asUint32(cell.y % gridY);
  const ModX = asUint32(cell.x % gridX);

  const index = asUint32(ModY * gridX + ModX);

  return index;
}
