/**
 * The site's primary navigation, in display order.
 *
 * WHY THERE IS A `ready` FLAG
 * ---------------------------
 * The site ships in phases. A nav link pointing at a page that does not exist
 * yet is a 404, and a 404 on a trust-building site is worse than a missing
 * link. So each item carries a `ready` flag: false items are simply not
 * rendered.
 *
 * When a page goes live, flip its flag to true. That is the only change
 * needed — the desktop nav, the mobile menu, and the footer all read from
 * this one list.
 */
import { canonicalPath } from './url';

export interface NavItem {
  label: string;
  href: string;
  ready: boolean;
}

export const navItems: readonly NavItem[] = [
  { label: 'About', href: '/about', ready: false },
  { label: 'History', href: '/history', ready: true },
  { label: 'Housing', href: '/housing', ready: true },
  { label: 'Ability Experience', href: '/ability-experience', ready: false },
  { label: 'For Parents', href: '/parents', ready: false },
  { label: 'Join', href: '/join', ready: true },
];

/** Only the items that currently have a real page behind them. */
export const liveNavItems = (): NavItem[] => navItems.filter((item) => item.ready);

/**
 * True when `href` is the page currently being rendered.
 * Used to set `aria-current="page"`, which screen readers announce.
 *
 * Both sides are normalised, so this keeps working whether the build emits
 * "/join", "/join/", or "/join.html".
 */
export function isCurrent(href: string, pathname: string): boolean {
  return canonicalPath(pathname) === canonicalPath(href);
}
