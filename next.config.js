/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: *",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: *",
              "style-src 'self' 'unsafe-inline' blob: data: *",
              "img-src 'self' 'unsafe-inline' blob: data: *",
              "font-src 'self' blob: data: *",
              "connect-src 'self' blob: data: *",
              "frame-src 'self' blob: data: *",
              "child-src 'self' blob: data: *",
              "object-src 'self' blob: data: *",
              "media-src 'self' blob: data: *",
              "worker-src 'self' blob: data: *"
            ].join('; ')
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig