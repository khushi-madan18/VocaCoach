import { StackClientApp } from "@stackframe/stack";

// export const stackClientApp = new StackClientApp({
//   tokenStore: "nextjs-cookie",
// });

export const stackClientApp = new StackClientApp({
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,  // UUID here
  tokenStore: "nextjs-cookie",
});
