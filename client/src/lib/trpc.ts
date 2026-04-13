import { createTRPCReact } from "@trpc/react-query";
// Simplified TRPC to avoid build errors on static hosting
export const trpc: any = createTRPCReact<any>();
