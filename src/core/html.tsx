import type { FC } from 'hono/jsx'
import { JsonRender, Layout } from './baseHtml'

const CommonPage: FC<{ data: object, title?: string, baseData?: object }> = (props) => {
  return (
    <Layout title={props.title}>
      <section class="col-12">
        {props.baseData?.ip && <h1>你的IP: {props.baseData.ip}</h1>}

        <div>
          <JsonRender value={props.data} />
        </div>
      </section>
    </Layout>
  )
}

export { CommonPage }
