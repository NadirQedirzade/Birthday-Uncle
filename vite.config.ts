import { existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const GALLERY_DIR = fileURLToPath(new URL('./public/images/gallery', import.meta.url))
const IMAGE_FILE = /\.(jpe?g|png|webp|avif|gif)$/i

/**
 * Exposes the list of photos that actually exist in public/images/gallery as
 * `virtual:gallery-files`. The gallery only requests files from that list, so a
 * photo you haven't added yet shows a placeholder without a failed network request
 * (and therefore without a 404 in the browser console).
 */
function galleryManifest(): Plugin {
  const virtualId = 'virtual:gallery-files'
  const resolvedId = `\0${virtualId}`

  const list = () =>
    existsSync(GALLERY_DIR)
      ? readdirSync(GALLERY_DIR)
          .filter((file) => IMAGE_FILE.test(file))
          .sort()
          .map((file) => `/images/gallery/${file}`)
      : []

  return {
    name: 'gallery-manifest',
    resolveId: (source) => (source === virtualId ? resolvedId : null),
    load: (id) => (id === resolvedId ? `export default ${JSON.stringify(list())}` : null),
    configureServer(server) {
      server.watcher.add(GALLERY_DIR)
      const refresh = (file: string) => {
        if (!file.startsWith(GALLERY_DIR)) return
        const module = server.moduleGraph.getModuleById(resolvedId)
        if (module) server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', refresh)
      server.watcher.on('unlink', refresh)
    },
  }
}

// Plain static build: no backend, no environment variables, root-relative asset paths.
export default defineConfig({
  plugins: [react(), tailwindcss(), galleryManifest()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 700,
  },
})
