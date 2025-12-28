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
      padding:1rem 4rem;
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
  /* background: url('https:/fimg.yuaner.tw/background/morphogenesis-l.svg') no-repeat center center; */
  /* background-size: cover; */
`

const baseClasses = css`
  body{
    margin: 0;
    padding: 0;
  }
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

const baseStyle = css `
  body { background: #fafafa; color: #333; }
  @media (prefers-color-scheme: dark) {
    body { background: #303341; color: white;}
  }
`;

const mainStyle = css`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  color: white; /* Force white text for glassmorphism usually */
  text-shadow: 0 1px 3px rgba(0,0,0,0.2);
`;

const blockStyle = css`
  .block{
  }
  .block-border{
  }
`;


/* ----------------------------------------------------
Layout區
---------------------------------------------------- */

const Layout: FC = (props) => {
  return (
    <Base title={props.title}>
      <div id="main" class={cx(mainClass, mainStyle)}>
        <div class={cx('container', gridClass, blockClass)}>
            {props.children}
        </div>
      </div>
    </Base>
  )
}


const Base: FC = (props) => {
  return (
    <html lang="zh-tw" class={cx(baseClasses, baseStyle)}>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <title>{props.title ?? '查看你的公網IP'}</title>
      <Style />
    </head>
    <body>
      <div id="background" class={appBackgroundClass}>
      </div>

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
