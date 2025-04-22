// @ts-ignore
import anime from 'animejs';

/**
 * Animate all immediate children of the given root element on mount.
 * Fades in and slides up each child sequentially for a smooth entrance effect.
 */
export function animatePageChildren(root: HTMLElement, baseDelay = 100) {
  if (!root) return;
  const children = Array.from(root.children) as HTMLElement[];
  anime({
    targets: children,
    opacity: [0, 1],
    translateY: [40, 0],
    duration: 800,
    delay: anime.stagger(baseDelay),
    easing: 'easeOutExpo',
  });
}
