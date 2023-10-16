export function getConfig() {
  return {
    syncEndpoint: "https://cg.optimizely.com/api/content/v2/data?id=wp",
    authorizationKey: `${process.env.OG_APP_KEY}:${process.env.OG_APP_SECRET}`,
  };
}
