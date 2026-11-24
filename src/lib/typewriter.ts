/**
 * How many characters of a typed-out message should be visible after
 * `elapsedMs`, typing one character every `msPerChar` milliseconds.
 */
export function charsVisible(
  elapsedMs: number,
  msPerChar: number,
  total: number,
): number {
  if (msPerChar <= 0) return total;
  return Math.max(0, Math.min(total, Math.floor(elapsedMs / msPerChar)));
}
