import type { ObjectValuesUnion } from "./types";

const RoutingPathBase = {
  PROBAND_HOME: "/home",
  PROBAND_FORM: "/form",
  LOGIN: "/login",
  OIDC_LOGIN: "/oidc-login",
  LOGOUT: "/logout",
  AUTH: "/auth",
  PHANTOM_FORM: "/auth/phantom-form",
  WAITING_ROOM: "/auth/waiting-room",
  WAITING_ROOM_FORM: "/auth/waiting-room/form",
  APPROVAL_ROOM: "/auth/approval-room",
  APPROVAL_ROOM_FORM: "/auth/approval-room/form",
  RECENT_VISITS: "/auth/recent-visits",
  RECENT_VISITS_DUPLICATE: "/auth/recent-visits/duplicate",
  RECENT_VISITS_VISIT: "/auth/recent-visits/visit",
} as const;

/**
 * Logical routing paths.
 */
export const RoutingPath = {
  ...RoutingPathBase,
  AUTH_HOME: RoutingPathBase.WAITING_ROOM,
} as const;

export type RoutingPath = ObjectValuesUnion<typeof RoutingPath>;
