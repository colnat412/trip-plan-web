export const isNavigationActive = (pathname: string, href: string): boolean =>
  (href === '/overview' && pathname === '/') ||
  pathname === href ||
  pathname.startsWith(`${href}/`);
