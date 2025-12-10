export const Logger = {
  log(message: string, ...meta: unknown[]) {
    console.log(`[LOG]: ${message}`, meta);
  },
  error(message: string, ...meta: unknown[]) {
    console.error(`[ERROR]: ${message}`, meta);
  },
  warn(message: string, ...meta: unknown[]) {
    console.warn(`[WARN]: ${message}`, meta);
  },
};
