import { next } from "@vercel/edge";

export const config = {
  matcher: ["/"],
};

function middleware(req: Request) {
  const basicAuth = req.headers.get("authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    if (user === "4dmin" && pwd === "testpwd123") {
      return next();
    }
  }

  return new Response("Authentication required!", {
    status: 401,
    headers: {
      "WWW-Authenticate": "Basic realm='Secure Area'",
    },
  });
}

export default middleware;
