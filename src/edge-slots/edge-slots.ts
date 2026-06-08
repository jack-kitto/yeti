/** Default handle diameter in pixels. */
export const EDGE_HANDLE_SIZE_PX = 40;

/** Minimum center-to-center spacing between handles on one rim. */
export const EDGE_MIN_HANDLE_SPACING_PX = 48;

/** Center positions (px along the rim axis) for each edge slot. */
export function computeEdgeSlotCenters(
  groupCount: number,
  edgeLengthPx: number,
  minSpacingPx: number = EDGE_MIN_HANDLE_SPACING_PX,
): number[] {
  if (groupCount <= 0) {
    return [];
  }
  if (groupCount === 1) {
    return [edgeLengthPx / 2];
  }

  const inset = minSpacingPx / 2;
  const available = edgeLengthPx - minSpacingPx;
  const gap = available / (groupCount - 1);

  return Array.from({ length: groupCount }, (_, index) => inset + index * gap);
}

/** Snap a drag position to the nearest slot index. */
export function nearestSlotIndex(
  positionPx: number,
  slotCenters: readonly number[],
): number {
  let bestIndex = 0;
  let bestDistance = Infinity;

  for (let index = 0; index < slotCenters.length; index++) {
    const distance = Math.abs(positionPx - slotCenters[index]);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  }

  return bestIndex;
}
