import type { FC } from 'hono/jsx'
import { JsonRender, Layout } from './baseHtml'

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
