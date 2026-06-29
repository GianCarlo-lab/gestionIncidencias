export const APP_CONFIG = {
  name: 'Pide Servicio',
  version: '0.1.0',
  env: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
