import type { FC } from 'hono/jsx'
import { css, cx, Style } from 'hono/css'

/* ----------------------------------------------------
Helper區
---------------------------------------------------- */
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

  @media (min-width: 640px) {
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
  @media (min-width: 1024px) {
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

/* ----------------------------------------------------
Style區
---------------------------------------------------- */

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
  /* background: url('https:/fimg.yuaner.tw/background/morphogenesis-l.svg') no-repeat center center; */
  /* background-size: cover; */
`

const baseClasses = css`
  body { background: #fafafa; }
  @media (prefers-color-scheme: dark) {
    body { background: #303341; color: white;}
  }
`;

const mainClass = css`
  margin: 50 auto;
  max-width: 768px;
  border: 1px solid white;
`;


/* ----------------------------------------------------
Layout區
---------------------------------------------------- */

const Layout: FC = (props) => {
  return (
    <Base title={props.title}>
      <div id="main" class={mainClass}>
        <div class={cx('container', gridClass)}>
            {props.children}
        </div>
      </div>
    </Base>
  )
}


const Base: FC = (props) => {
  return (
    <html lang="zh-tw" class={baseClasses}>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <title>{props.title ?? '查看你的公網IP'}</title>
      <Style />
    </head>
    <body>
      <div id="background" class={appBackgroundClass}>
      </div>

      <main id="app-content" class="app-content" style={`padding-top: env(safe-area-inset-top);`}>
        {props.children}
      </main>
    </body>
    </html>
  )
}


/* ----------------------------------------------------
設定哪些組件要開放
---------------------------------------------------- */
export {Layout, JsonRender};
