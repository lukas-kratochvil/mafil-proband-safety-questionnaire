export enum RoutingPath {
  PROBAND_HOME = "/home",
  PROBAND_FORM = "/form",
  LOGIN = "/login",
  AUTH = "/auth",
  PHANTOM_FORM = `${AUTH}/phantom-form`,
  WAITING_ROOM = `${AUTH}/waiting-room`,
  APPROVAL_ROOM = `${AUTH}/approval-room`,
  RECENT_VISITS = `${AUTH}/recent-visits`,
}
