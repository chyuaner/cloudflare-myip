import type { FC } from 'hono/jsx'

const Layout: FC = (props) => {
  return (
    <Base title={props.title}>
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
      <title>{props.title ?? '查看你的公網IP'}</title>
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

const JsonRender: FC<{ value: unknown }> = ({ value }) => {
  // 內部仍然使用同一個遞迴函式（名稱改為 renderValue）
  const renderValue = (v: unknown): FC.Element => {
    if (
      typeof v === 'string' ||
      typeof v === 'number' ||
      typeof v === 'boolean' ||
      v === null
    ) {
      return <span>{String(v)}</span>
    }

    if (Array.isArray(v)) {
      return (
        <ul>
          {v.map((item, idx) => (
            <li key={idx}>{renderValue(item)}</li>
          ))}
        </ul>
      )
    }

    if (typeof v === 'object') {
      return (
        <ul>
          {Object.entries(v as Record<string, unknown>).map(
            ([k, val]) => (
              <li key={k}>
                <strong>{k}:</strong> {renderValue(val)}
              </li>
            )
          )}
        </ul>
      )
    }

    return <span>Unsupported</span>
  }

  return renderValue(value)
}

const CommonPage: FC<{ data: object, title?: string, baseData?: object }> = (props) => {
  return (
    <Layout title={props.title}>
      {props.baseData?.ip && <h1>你的IP: {props.baseData.ip}</h1>}

      <div>
        <JsonRender value={props.data} />
      </div>
    </Layout>
  )
}

export { CommonPage }
