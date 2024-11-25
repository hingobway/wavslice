import { LogicalPosition, Window } from '@tauri-apps/api/window';

export async function relativeWindowPos(
  parentName: string,
  props: {
    w?: number;
    h?: number;
    x?: number;
    y?: number;
    center?: 'x' | 'y' | 'xy';
  },
) {
  const { w: W, h: H, x: X, y: Y, center } = props;
  const WIDTH = W ?? 0;
  const HEIGHT = H ?? 0;
  const OFFSET_X = X ?? 0;
  const OFFSET_Y = Y ?? 0;
  const CENTER_X = WIDTH && (center === 'x' || center === 'xy') ? 1 : 0;
  const CENTER_Y = HEIGHT && (center === 'y' || center === 'xy') ? 1 : 0;

  const win = await Window.getByLabel(parentName);
  const scale = await win?.scaleFactor();
  const ps = scale ? (await win?.outerSize())?.toLogical(scale) : undefined;
  const current = await win?.outerPosition();
  const locl = scale && current ? current.toLogical(scale) : undefined;

  const xy =
    locl && ps
      ? new LogicalPosition(
          locl.x + OFFSET_X - ((WIDTH - ps.width) / 2) * CENTER_X,
          locl.y + OFFSET_Y - ((HEIGHT - ps.height) / 2) * CENTER_Y,
        )
      : undefined;

  return xy;
}
