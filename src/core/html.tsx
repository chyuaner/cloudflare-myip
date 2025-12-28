import type { FC } from 'hono/jsx'
import { gridClass, JsonRender, Layout } from './baseHtml'


/* ----------------------------------------------------
Components 區
---------------------------------------------------- */
const IpDiv: FC<{ ip:string, longitude?: string, latitude?: string}> = (props) => {
  return (
    <section>
      <div>
        <h2>你目前的IP：</h2>
        <p>{props.ip}</p>
      </div>

      { (props.longitude || props.latitude) &&
        <div>
          <header>
            📌
          </header>
          <ul class={gridClass}>
            <li class="col-6">
              longitude: {props.longitude}
            </li>
            <li class="col-6">
              latitude: {props.latitude}
            </li>
          </ul>
        </div>
      }
    </section>
  );
}


/* ----------------------------------------------------
Pages 區
---------------------------------------------------- */
const IndexPage: FC<{ data: object, title?: string, baseData?: object }> = (props) => {
  return (
    <Layout title={props.title}>

      <div class="col-12">
        <IpDiv
          ip={props.data.ip}
          longitude={props.data.longitude}
          latitude={props.data.latitude}
        />
      </div>

    </Layout>
  );
}

const CommonPage: FC<{ data: any, title?: string, baseData?: object }> = (props) => {
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

export { IndexPage, CommonPage }
