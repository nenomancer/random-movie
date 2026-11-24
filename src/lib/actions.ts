/**
 * Svelte action: calls `callback` when a click lands outside `node`.
 * Listens in the capture phase so it still fires if something inside the page
 * stops propagation.
 */
export function clickOutside(node: HTMLElement, callback: () => void) {
  const handleClick = (event: MouseEvent) => {
    if (!node.contains(event.target as Node)) {
      callback();
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    update(next: () => void) {
      callback = next;
    },
    destroy() {
      document.removeEventListener("click", handleClick, true);
    },
  };
}
