export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SENDER_PRIVATE_KEY: string;
      RECEIVER_PRIVATE_KEY: string;
    }
  }
}