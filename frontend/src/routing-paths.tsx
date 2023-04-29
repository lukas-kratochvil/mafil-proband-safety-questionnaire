export enum RoutingPath {
  PROBAND_HOME = "/home",
  PROBAND_FORM = "/form",
  LOGIN = "/login",
  AUTH = "/auth",
  PHANTOM_FORM = `${AUTH}/phantom-form`,
  WAITING_ROOM = `${AUTH}/waiting-room`,
  WAITING_ROOM_FORM = `${WAITING_ROOM}/form`,
  APPROVAL_ROOM = `${AUTH}/approval-room`,
  APPROVAL_ROOM_FORM = `${APPROVAL_ROOM}/form`,
  RECENT_VISITS = `${AUTH}/recent-visits`,
  RECENT_VISITS_DUPLICATE = `${RECENT_VISITS}/duplicate`,
  RECENT_VISITS_VISIT = `${RECENT_VISITS}/visit`,
}
