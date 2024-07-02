/**
 * These are environment variables.
 * They will be substituted during Nginx Docker container startup.
 *
 * Required format is: ```key: "$key"```
 */
const envVars = {
  APP_BAR_COLOR: "$APP_BAR_COLOR",
  JPM_AUTHORIZATION_ENDPOINT: "$JPM_AUTHORIZATION_ENDPOINT",
  JPM_CLIENT_ID: "$JPM_CLIENT_ID",
  JPM_REDIRECT_URI: "$JPM_REDIRECT_URI",
  JPM_SCOPES: "$JPM_SCOPES",
  JPM_MFA_ENDPOINT: "$JPM_MFA_ENDPOINT",
  JPM_POST_LOGOUT_REDIRECT_URI: "$JPM_POST_LOGOUT_REDIRECT_URI",
  MAFILDB_API_URL: "$MAFILDB_API_URL",
  MAFILDB_VISITS_MAX_DAYS_OLD: "$MAFILDB_VISITS_MAX_DAYS_OLD",
} as const;

export default envVars;
