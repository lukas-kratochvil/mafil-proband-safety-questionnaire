/**
 * These are environment variables.
 * They will be substituted during Nginx Docker container startup.
 *
 * Required format is: ```key: "$key"```
 */
const envVars = {
  APP_BAR_COLOR: "$APP_BAR_COLOR",
  JPM_CLIENT_ID: "$JPM_CLIENT_ID",
  MAFILDB_API_URL: "$MAFILDB_API_URL",
  MAFILDB_VISITS_MAX_DAYS_OLD: "$MAFILDB_VISITS_MAX_DAYS_OLD",
} as const;

export default envVars;
