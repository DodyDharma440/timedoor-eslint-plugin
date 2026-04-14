import { next } from "@vercel/edge";

export const config = {
  matcher: ["/"],
};

function middleware(req: Request) {
  const basicAuth = req.headers.get("authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    if (
      user === process.env.BASIC_AUTH_USER &&
      pwd === process.env.BASIC_AUTH_PASSWORD
    ) {
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
