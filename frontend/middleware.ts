// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/chat", "/signin", "/signup"],
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // this excludes _next and static files
};
