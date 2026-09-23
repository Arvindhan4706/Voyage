import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ["en","es","fr","de","hi","zh","ja","pt","ru","ar","it","ko","nl","tr","pl","sv","da","fi","no","el","cs","hu","ro","th","vi","id","ms","bn","ta","te","ur"],
  defaultLocale: 'en'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|es|fr|de|hi|zh|ja|pt|ru|ar|it|ko|nl|tr|pl|sv|da|fi|no|el|cs|hu|ro|th|vi|id|ms|bn|ta|te|ur)/:path*', '/((?!api|_next|_vercel|.*\\\\..*).*)']
};
