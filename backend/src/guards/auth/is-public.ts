import { SetMetadata } from "@nestjs/common";

/**
 * Custom decorator for enabling some routes to be public (skips authorization procedure)
 */
export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
