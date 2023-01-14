import { ElectronHandler } from 'main/preload';

declare global {
  interface Window {
    electron: ElectronHandler;
  }
  interface Token {
    hash: string;
    comment: string;
  }
}

export {};
