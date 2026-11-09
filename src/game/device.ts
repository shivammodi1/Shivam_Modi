/** Phones and tablets with no mouse can't play a pointer-lock shooter, so they get the classic site. */
export function isTouchOnly() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(pointer: coarse)").matches && !window.matchMedia("(any-pointer: fine)").matches;
}
