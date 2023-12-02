declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LIST_CHANNEL_FILE_PATH: string;
    }
  }
}
export {};
