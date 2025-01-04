import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/clerk-webhook',
  '/api/drive-activity/notification',
  '/api/payment/success',
]);

const isApiRouteToSkip = createRouteMatcher([
  '/api/auth/callback/discord',
  '/api/auth/callback/notion',
  '/api/auth/callback/slack',
  '/api/flow',
  '/api/cron/wait',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request) && !isApiRouteToSkip(request)) {
    await auth.protect()
  }
})

// export default authMiddleware({
//   publicRoutes: [
//     '/',
//     '/api/clerk-webhook',
//     '/api/drive-activity/notification',
//     '/api/payment/success',
//   ],
//   ignoredRoutes: [
//     '/api/auth/callback/discord',
//     '/api/auth/callback/notion',
//     '/api/auth/callback/slack',
//     '/api/flow',
//     '/api/cron/wait',
//   ],
// })

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

// https://www.googleapis.com/auth/userinfo.email
// https://www.googleapis.com/auth/userinfo.profile
// https://www.googleapis.com/auth/drive.activity.readonly
// https://www.googleapis.com/auth/drive.metadata
// https://www.googleapis.com/auth/drive.readonly