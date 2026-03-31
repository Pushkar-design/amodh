/** Returns true if closed intervals [aStart, aEnd] and [bStart, bEnd] overlap (inclusive). */
export function isDateOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  return aStart <= bEnd && aEnd >= bStart;
}
