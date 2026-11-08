/// <reference types="vite/client" />

declare module 'virtual:gallery-files' {
  /** Public paths of the images that exist in public/images/gallery at build time. */
  const files: string[]
  export default files
}
