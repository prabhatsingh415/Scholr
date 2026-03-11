/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SCHOLR_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
