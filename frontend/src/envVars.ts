/**
 * These are environment variables.
 * They will be substituted during Nginx Docker container startup using 'envsubst' command.
 *
 * Required format is one of:
 *    - key: "$key"
 *    - key: "${key}"
 */
const envVars = {
  APP_BAR_COLOR: "$APP_BAR_COLOR",
  JPM_CLIENT_ID: "$JPM_CLIENT_ID",
};

export default envVars;
