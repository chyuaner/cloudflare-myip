import type { FC, PropsWithChildren } from 'hono/jsx'
import { css, cx, Style } from 'hono/css'
import { ASSETS } from './assets.gen.js'

/* ----------------------------------------------------
Helper區
---------------------------------------------------- */
const JsonRender: FC<{ value: unknown }> = ({ value }) => {
  // 內部仍然使用同一個遞迴函式（名稱改為 renderValue）
  const renderValue = (v: unknown) => {
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

const gridClass = css`
  /* 1️⃣ 設定父容器為 Grid */
  display: grid;                     /* 啟用 Grid */
  grid-template-columns: repeat(12, 1fr);   /* 12 等分的欄 */
  gap: 0.5rem;                         /* 欄位之間的間距 */

  /* 2️⃣ 子項目使用 span 來跨欄 */
  .col-1     { grid-column: span 12; }
  .col-2     { grid-column: span 12; }
  .col-3     { grid-column: span 12; }
  .col-lg-3  { grid-column: span 12; }
  .col-4     { grid-column: span 12; }
  .col-lg-4  { grid-column: span 12; }
  .col-5     { grid-column: span 12; }
  .col-6     { grid-column: span 12; }
  .col-8     { grid-column: span 12; }
  .col-lg-8  { grid-column: span 12; }
  .col-9     { grid-column: span 12; }
  .col-lg-9  { grid-column: span 12; }
  .col-12    { grid-column: span 12; }

  @media (min-width: 480px) {
      .col-1    { grid-column: span 1; }
      .col-2    { grid-column: span 2; }
      .col-3    { grid-column: span 3; }
      .col-lg-3 { grid-column: span 12; }
      .col-4    { grid-column: span 4; }
      .col-lg-4 { grid-column: span 12; }
      .col-5    { grid-column: span 5; }
      .col-6    { grid-column: span 6; }
      .col-8    { grid-column: span 8; }
      .col-lg-8 { grid-column: span 12; }
      .col-9    { grid-column: span 9; }
      .col-lg-9 { grid-column: span 12; }
      .col-12   { grid-column: span 12; }
  }
  @media (min-width: 640px) {
      .col-1    { grid-column: span 1; }
      .col-2    { grid-column: span 2; }
      .col-3    { grid-column: span 3; }
      .col-lg-3 { grid-column: span 3; }
      .col-4    { grid-column: span 4; }
      .col-lg-4 { grid-column: span 4; }
      .col-5    { grid-column: span 5; }
      .col-6    { grid-column: span 6; }
      .col-lg-8 { grid-column: span 8; }
      .col-8    { grid-column: span 8; }
      .col-9    { grid-column: span 9; }
      .col-lg-9 { grid-column: span 9; }
      .col-12   { grid-column: span 12; }
  }
`;

const blockClass = css`
  .block{
    margin:0.5rem 0;
    padding:1rem;

    @media (min-width: 640px) {
      padding:1rem 3rem;
    }
  }
  .block-border{border-width:1px;border-style:solid;}
`;

const appBackgroundClass = css `
  position: fixed;
  inset: 0;                         /* top / right / bottom / left = 0 */
  width: 100vw;
  height: 100vh;
  /* 把安全區的 inset 加回去，讓背景延伸至瀏海、動態島 */
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  z-index: -1;
`

const baseClasses = css`
  margin: 0;
  padding: 0;
`;

const appContentClass = css `
  display: flex;
  // margin: 0;
  margin-top: env(safe-area-inset-top);
  max-width: 100vw;
  min-height: 100vh;
  @supports (height: 100dvh) {
      min-height: 100dvh;
  }
  min-height: 100dvh;
  align-items: center;
  justify-content: center;
`;

const mainClass = css`
  width: 100%;
  margin: 1rem;
  max-width: 768px;

  @media (min-width: 480px) {
    margin: 2rem;
  }
`;

/* ----------------------------------------------------
Style區
---------------------------------------------------- */

const blockStyle = css`
  .block{
  }
  .block-border{
  }
`;

const GlobalStyle = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @font-face {
      font-family: 'CustomFont';
      src: url('/font.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    body {
      font-family: 'CustomFont', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      margin: 0;
      padding: 0;
      background: #eceff4;
      background: linear-gradient(135deg,  #f6f8f9 0%, #e5ebee 50%, #d7dee3 56%, #f5f7f9 100%);
      color: #333;
    }
    hr {
      border: 0;
      height: 1px;
      background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0));
      margin: 0.1rem 0;
      grid-column: span 12;
    }
    @media (prefers-color-scheme: dark) {
      body {
        background: #353a52;
        background: linear-gradient(149deg,rgba(40, 42, 54, 1) 0%, rgba(51, 54, 69, 1) 13%, rgb(53, 58, 82) 30%, rgba(44, 47, 62, 1) 53%, rgba(40, 42, 54, 1) 93%, rgba(62, 54, 71, 1) 100%);
        color: white;
      }
      hr {
        background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
      }
    }
  ` }} />
);


/* ----------------------------------------------------
Layout區
---------------------------------------------------- */
export interface BaseData {
  longitude?: string;
  latitude?: string;
  baseUrl?: string;
  [key: string]: any;
}

const Footer = () => {
  const style = css `
    padding: 0 1rem;
    margin-top: 1rem;
    @media (min-width: 480px) {
        div.right {
            text-align: right;
        }
    }

    p { margin: 0.5em 0; }
    a {
      text-decoration: none;
      color: inherit;
      transition: opacity 0.2s;
      &:hover {
        opacity: 0.7;
      }
    }
  `;

  return (<footer class={style}>
    <div class={cx('container', gridClass)}>
        <div class="col-8">
            <p>© 2026 由 <a href="https://yuaner.tw" target={'_blank'}>Yuan Chiu</a> 製作，並採用 <a href="https://github.com/chyuaner/cloudflare-myip/blob/master/LICENSE" target={'_blank'}>MIT License</a> 授權</p>
        </div>
        <div class="col-4 right">
            <p><a href="https://github.com/chyuaner/cloudflare-myip" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brand-github"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" /></svg>
                View on Github
            </a></p>
        </div>
    </div>
  </footer>)
}

const Layout: FC<PropsWithChildren<{ title?: string, baseData?: BaseData }>> = (props) => {
  return (
    <Base title={props.title} baseData={props.baseData}>
      <div id="main" class={cx(mainClass)}>
        <div class={cx('container', gridClass, blockClass, mainStyle)}>
            {props.children}
        </div>
        <Footer />
      </div>
    </Base>
  )
}

const appBackgroundStyle = css `
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  opacity: 0;
  transform: scale(1.3); /* 從 1.3 倍放大開始 */
  transition: opacity 3s ease-out, transform 3s cubic-bezier(0.16, 1, 0.3, 1); /* 柔和的 3 秒動畫 */

  &.loaded {
    opacity: 1;
    transform: scale(1); /* 縮回原大小 */
  }
`;

const mainStyle = css`
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);

  @media (prefers-color-scheme: dark) {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
    color: white;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
`;


const Base: FC<PropsWithChildren<{ title?: string, baseData?: BaseData }>> = (props) => {
  const { longitude, latitude, baseUrl } = props.baseData || {};
  const PUBLIC_BASE_URL = baseUrl || '';
  const params = [
    longitude ? `longitude=${longitude}` : '',
    latitude ? `latitude=${latitude}` : ''
  ].filter(Boolean).join('&');

  const lightBg = `/background${params ? `?${params}` : ''}`;
  const darkBg = `/background?dark=true${params ? `&${params}` : ''}`;

  const description = '本站提供你的IP檢測服務，包括 ISP、ASN、國家、城市、大洲、時區等詳細數據，並支援 IPv4 與 IPv6 。除了提供網頁界面以外，也提供純文字、JSON輸出，可用Postman當做API服務使用。';
  const keywords = 'MyIP, myip, 我的公網IP, 我的IP';

  return (
    <html lang="zh-tw" class={baseClasses}>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <title>{props.title ?? '查看你的公網IP'}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content="查看你的公網IP" />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {PUBLIC_BASE_URL && <meta property="og:url" content={PUBLIC_BASE_URL} />}
      <meta property="og:image" content={PUBLIC_BASE_URL ? `${PUBLIC_BASE_URL}/ip.png` : '/ip.png'} />
      <meta property="og:site_name" content="查看你的公網IP" />
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="查看你的公網IP" />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={PUBLIC_BASE_URL ? `${PUBLIC_BASE_URL}/ip.png` : '/ip.png'} />
      <Style />
      <GlobalStyle />
      {/* 這裡是後端直接輸出的 CSS，確保 No-JS 也能抓到正確網址 */}
      <style dangerouslySetInnerHTML={{ __html: `
        #background {
          background-image: url('${lightBg}');
        }
        @media (prefers-color-scheme: dark) {
          #background {
            background-image: url('${darkBg}');
          }
        }
      ` }} />
      {/* 如果關閉 JS，強制顯示背景 */}
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: `
          #background { opacity: 1 !important; transform: scale(1) !important; }
        ` }} />
      </noscript>
    </head>
    <body>
      <div id="background" class={cx(appBackgroundClass, appBackgroundStyle)}>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          const bg = document.getElementById('background');
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const longitude = "${props.baseData?.longitude || ''}";
          const latitude = "${props.baseData?.latitude || ''}";

          let url = isDark ? '/background?dark=true' : '/background';
          if (longitude) url += (url.includes('?') ? '&' : '?') + 'longitude=' + longitude;
          if (latitude) url += (url.includes('?') ? '&' : '?') + 'latitude=' + latitude;

          const img = new Image();
          img.onload = function() {
            bg.style.backgroundImage = 'url(' + url + ')';
            bg.classList.add('loaded');
          };
          img.onerror = function() {
            bg.style.backgroundImage = 'url(' + url + ')';
            bg.classList.add('loaded'); // 即使失敗也顯示
          };
          img.src = url;
          // 如果已經在快取中
          if (img.complete) img.onload();

          // 安全機制：最晚 3 秒後一定要顯示
          setTimeout(() => {
            if (!bg.classList.contains('loaded')) {
              bg.style.backgroundImage = 'url(' + url + ')';
              bg.classList.add('loaded');
            }
          }, 3000);
        })();
      ` }} />

      <main id="app-content" class={appContentClass}>
        {props.children}
      </main>
    </body>
    </html>
  )
}


/* ----------------------------------------------------
設定哪些組件要開放
---------------------------------------------------- */
export {Layout, JsonRender, gridClass};
