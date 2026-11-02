import type {NextConfig} from 'next'

const config: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  images: {remotePatterns: [{protocol: 'https', hostname: 'cdn.sanity.io'}]},
  async rewrites() {
    return {fallback: [{source: '/admin/:path*', destination: '/admin/index.html'}]}
  },
  async headers() {
    return [{source:'/admin/:path*',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'}]}]
  },
}
export default config
