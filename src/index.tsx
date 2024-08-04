import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-pages'

const app = new Hono()
app.use('/static/*', serveStatic())

const routes = app.get('/api/clock', (c) => {
  return c.json({
    time: new Date().toLocaleTimeString()
  })
})

export type AppType = typeof routes

app.get('*', (c) => {
  const title = '住宅ローン簡易計算ツール'
  const description = '住宅ローンを簡易的に計算できるツールです。毎月、毎年、トータルの支払い額が計算できます'
  const keywords = '利上げ,住宅ローン,短プラ,変動金利'
  const ogpUrl = 'https://home-loan-calculator.pages.dev/'
  return c.html(
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={ogpUrl} />
        <meta property="og:site_name" content={title} />
        <meta property="og:image" content="https://home-loan-calculator.pages.dev/static/images/home-loan.png" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <title>住宅ローン簡易計算ツール</title>
        {import.meta.env.PROD ? (
          <script type="module" src="/static/client.js"></script>
        ) : (
          <script type="module" src="/src/client.tsx"></script>
        )}
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  )
})

export default app