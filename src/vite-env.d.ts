/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CV_PROFILE?: "public" | "private";
  readonly VITE_CV_DATA_FILE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
