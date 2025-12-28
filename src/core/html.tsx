import type { FC } from 'hono/jsx'
import { gridClass, JsonRender, Layout } from './baseHtml'
import { css } from 'hono/css';


/* ----------------------------------------------------
Components 區
---------------------------------------------------- */
const IpDiv: FC<{ ip:string, longitude?: string, latitude?: string}> = (props) => {
  const style = css `
    h2 {
      font-size: 1rem;
    }
    main {
      // padding: 0 1rem;
    }

    .main-text {
      text-align: center;
      font-size: 2rem;
      p {
        margin: 2rem 0;
      }
      .ipv4 {
          @media (min-width: 480px) {
            font-size: 3rem;
          }
          @media (min-width: 640px) {
            font-size: 4rem;
          }
      }
    }

    .pos {
      display: flex;
      align-items: center;
      justify-content: center;
      ul {
        // flex: 1;

        li {
          list-style: none;
          width: max-content;

          @media (min-width: 640px) {
            margin-right: 2rem;
          }

        }
      }
    }
  `;

  return (
    <section class={style}>
      <header>
        <h2>你目前的IP：</h2>
      </header>
      <main>
        <div class="main-text">
          <p>{props.ip}</p>
          {/* <p class="ipv4">192.168.253.112</p> */}
          {/* <p style="word-break: break-all">2001:b400:e2c2:a8bb:e97d:75b:7b16:b6fe</p> */}
        </div>

        { (props.longitude || props.latitude) &&
          <div class="pos">
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
      </main>
    </section>
  );
}

const DateTimeDiv: FC<{ time:string, date?: string, tz?: string, stz?: string}> = (props) => {
  const style = css `
    h2 {
      font-size: 1rem;
    }

    @media (min-width: 480px) {
      header {
        display: flex;
        align-items: center;
      }
      h2 {flex: 1;}
    }

    .main-text {
      text-align: center;
      font-size: 4rem;
      p {
        margin-top: 2rem;
        margin-bottom: 0;
      }
    }

    .submain-text {
      text-align: right;
      font-size: 1.5rem;
    }

  `;

  return (
    <section class={style}>
      <header>
        <h2>Now</h2>
        <div class="right">
          {props.tz} {props.stz}
        </div>
      </header>
      <main>
        <div class="main-text">
          <p>{props.time}</p>
          {/* <p>22:22:22</p> */}
        </div>

        <div class="submain-text right">
          {props.date}
        </div>
      </main>
    </section>
  );
}



/* ----------------------------------------------------
Pages 區
---------------------------------------------------- */
const IndexPage: FC<{ data: object, title?: string, baseData?: object }> = (props) => {
  return (
    <Layout title={props.title}>

      <div class="block col-12">
        <IpDiv
          ip = {props.data.ip}
          longitude = {props.data.longitude}
          latitude = {props.data.latitude}
        />
      </div>

      <div class="block col-12">
        <DateTimeDiv
          time = {props.data.now.time}
          date = {props.data.now.date}
          tz = {props.data.now.tz}
          stz = {props.data.now.stz}
        />
      </div>

    </Layout>
  );
}

const CommonPage: FC<{ data: any, title?: string, baseData?: object }> = (props) => {
  return (
    <Layout>
      <section class="block col-12">
        {/* {props.baseData?.ip && <h1>你的IP: {props.baseData.ip}</h1>} */}
        {props.title && <h2>{props.title}</h2>}

        <div class="block col-12">
          <section>
            <JsonRender value={props.data} />
          </section>
        </div>
      </section>
    </Layout>
  )
}

export { IndexPage, CommonPage }
