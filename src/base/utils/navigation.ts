export const isProfilePath = (pathname: string): boolean =>
  ['/profile', '/settings', '/saved-templates', '/my-templates'].some(
    path => pathname === path || pathname.startsWith(`${path}/`),
  );

export const isNavigationActive = (pathname: string, href: string): boolean =>
  (href === '/explore' && (pathname === '/templates' || pathname.startsWith('/templates/'))) ||
  (href === '/profile' && isProfilePath(pathname)) ||
  (href === '/overview' && pathname === '/') ||
  pathname === href ||
  pathname.startsWith(`${href}/`);
