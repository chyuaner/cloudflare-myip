import { Hono } from 'hono'
import type { FC } from 'hono/jsx'

const app = new Hono()


const Layout: FC = (props) => {
  return (
    <Base>
      <Container>
        {props.children}
      </Container>
    </Base>
  )
}

const Base: FC = (props) => {
  return (
    <html lang="zh-tw">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${props.title}</title>
    </head>
    <body>
      {props.children}
    </body>
    </html>
  )
}

const Container: FC = (props) => {
  return (
    <div id="main">
      <div class="container">
        {props.children}
      </div>
    </div>
  )
}

const Test: FC<{ messages: string[] }> = (props: {
  messages: string[]
}) => {
  return (
    <Layout>
      <h1>Hello Hono!</h1>
    </Layout>
  )
}

export { Test }
