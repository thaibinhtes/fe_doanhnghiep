/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_PREFIX?: string
  /** Dev only: Laravel origin for Vite proxy (default http://localhost:8002) */
  readonly VITE_API_PROXY_TARGET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
