import { jsxRenderer } from 'hono/jsx-renderer'
import { Script, ViteClient } from 'vite-ssr-components/hono'

const title = '住宅ローン簡易計算ツール'
const description = '住宅ローンを簡易的に計算できるツールです。毎月、毎年、トータルの支払い額が計算できます'
const keywords = '利上げ,住宅ローン,短プラ,変動金利'
const siteUrl = 'https://home-loan-calculator.kuri0403.workers.dev/'
const ogImage = `${siteUrl}static/images/home-loan.png`

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href="https://cdn.simplecss.org/simple.min.css" rel="stylesheet" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:site_name" content={title} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <title>{title}</title>
        <ViteClient />
        <Script src="/src/client.tsx" />
      </head>
      <body>{children}</body>
    </html>
  )
})
