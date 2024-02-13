import onRenderHtml from './+config/onRenderHtml'
import onRenderClient from './+config/onRenderClient'
import { PageLayout as PG2 } from './+config/PageLayout'
import type { Config } from 'vite-plugin-ssr/types'

// console.log(PG2)
console.log(11);

export default {
  onRenderClient,
  onRenderHtml,
  passToClient: ['pageProps']
} satisfies Config
