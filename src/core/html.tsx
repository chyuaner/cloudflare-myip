import type { FC } from 'hono/jsx'
import { gridClass, JsonRender, Layout } from './baseHtml.js'
import { css } from 'hono/css';
import { isIpv6 } from './data.js';


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
          color: #3b82f6; /* Modern Blue */
          @media (min-width: 480px) {
            font-size: 3rem;
          }
          @media (min-width: 640px) {
            font-size: 4rem;
          }
      }
      .ipv6 {
          color: #10b981; /* Modern Green */
          word-break: break-all;
      }

      @media (prefers-color-scheme: dark) {
        .ipv4 { color: #60a5fa; }
        .ipv6 { color: #34d399; }
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
            &:not(:first-child) {
              margin-left: 3rem;
            }
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
          <p class={isIpv6(props.ip) ? "ipv6" : "ipv4"}>{props.ip}</p>
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
          <p id="time-now">{props.time}</p>
          {/* <p>22:22:22</p> */}
        </div>

        <div class="submain-text right" id="date-now">
          {props.date}
        </div>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var e=document.getElementById("time-now"),t=document.getElementById("date-now");if(!e||!t)return;var n=e.innerText.trim().split(":"),r=t.innerText.trim().split("/");if(3!==n.length||3!==r.length)return;var a=parseInt(r[0],10),i=parseInt(r[1],10)-1,o=parseInt(r[2],10),c=parseInt(n[0],10),d=parseInt(n[1],10),s=parseInt(n[2],10),u=new Date(a,i,o,c,d,s),l=Date.now(),m=function(e){return e.toString().padStart(2,"0")};setInterval((function(){var n=Date.now()-l,r=new Date(u.getTime()+n);e.innerText=[r.getHours(),r.getMinutes(),r.getSeconds()].map(m).join(":"),t.innerText=[r.getFullYear(),m(r.getMonth()+1),m(r.getDate())].join("/")}),1e3)})();` }} />
      </main>
    </section>
  );
}

const DataItemsDiv: FC<{ items: Record<string, string> }> = (props) => {
  const style = css `
    h2 {
      font-size: 1rem;
      margin-bottom: 1rem;
      opacity: 0.9;
    }

    ul {
      padding-left: 0;
      gap: 1rem;
    }

    .card {
      /* Light Mode / Default */
      background: rgba(255, 255, 255, 0.6);
      padding: 1rem;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.6);
      transition: all 0.3s ease;
      list-style: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.02);

      &:hover {
        background: rgba(255, 255, 255, 0.8);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      }

      h3 {
        margin: 0;
        font-size: 0.85rem;
        opacity: 0.7;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #555;
      }

      p {
        margin: 0.5rem 0 0 0;
        font-weight: 500;
        word-break: break-word;
        color: #111;
      }

      /* Dark Mode */
      @media (prefers-color-scheme: dark) {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: none;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        h3 { color: rgba(255,255,255,0.7); }
        p { color: white; }
      }
    }
  `;

  return (
    <section class={style}>
      <h2>其他資訊</h2>

      {/* 依 items 產生列表 */}
      <ul class={gridClass}>
        {Object.entries(props.items).map(([key, value]) => (
          <li class="col-4 card" key={key}>
            <h3>{key}</h3>
            <p>{value}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}


/* ----------------------------------------------------
Pages 區
---------------------------------------------------- */
const IndexPage: FC<{ data: any, title?: string, baseData?: object }> = (props) => {
  return (
    <Layout title={props.title}>

      <div class="block col-12">
        <IpDiv
          ip = {props.data.ip}
          longitude = {props.data.longitude}
          latitude = {props.data.latitude}
        />
      </div>

      <hr />

      <div class="block col-12">
        <DateTimeDiv
          time = {props.data.now.time}
          date = {props.data.now.date}
          tz = {props.data.now.tz}
          stz = {props.data.now.stz}
        />
      </div>

      <hr />

      <div class="block col-12">
        <DataItemsDiv items={{
          asOrganization: props.data.asOrganization,
          asn           : props.data.asn,
          country       : props.data.country,
          city          : props.data.city,
          continent     : props.data.continent,
          region        : props.data.region,
          regionCode    : props.data.regionCode,
          timezone      : props.data.timezone,
          isEUCountry   : props.data.isEUCountry,
          postalCode    : props.data.postalCode,
          metroCode     : props.data.metroCode,
        }}
        />
      </div>

    </Layout>
  );
}

const CommonPage: FC<{ data: any, h2?: string, title?: string, baseData?: object }> = (props) => {
  return (
    <Layout title={props.title}>
      <section class="block col-12">
        {/* {props.baseData?.ip && <h1>你的IP: {props.baseData.ip}</h1>} */}
        {props.h2 && <h2>{props.h2}</h2>}

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
