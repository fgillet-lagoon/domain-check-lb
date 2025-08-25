import "express-session";

declare module "express-session" {
  interface SessionData {
    authenticated?: boolean;
    user?: {
      username: string;
    };
  }
}