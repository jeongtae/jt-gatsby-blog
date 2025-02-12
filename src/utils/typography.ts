import { CSSProperties } from "react";
import oc from "open-color";
import Typography from "typography";

interface Style {
  [selector: string]: CSSProperties;
}

const baseFonts = [
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Oxygen",
  "Ubuntu",
  "Cantarell",
  "Open Sans",
  "Helvetica Neue",
  "sans-serif",
];
function serializeFonts(fonts: string[]) {
  return fonts.map(font => (font.split(" ").length > 1 ? `'${font}'` : font)).join(", ");
}
const sansFonts = ["Noto Sans KR", ...baseFonts];
export const sansFontsSerialized = serializeFonts(sansFonts);
const serifFonts = ["Noto Serif KR", ...baseFonts];
export const serifFontsSerialized = serializeFonts(serifFonts);

export default new Typography({
  baseFontSize: "100px",
  baseLineHeight: 1,
  includeNormalize: true,
  googleFonts: [
    {
      /* https://fonts.google.com/specimen/Noto+Sans+KR */
      /* 100 300 400 500 700 900 */
      name: "Noto Sans KR",
      styles: ["300", "500"],
    },
    // {
    //   /* https://fonts.google.com/specimen/Noto+Serif+KR */
    //   /* 200 300 400 500 600 700 900 */
    //   name: "Noto Serif KR",
    //   styles: ["300", "500", "700"],
    // },
  ],
  headerFontFamily: sansFonts,
  bodyFontFamily: sansFonts,
  headerWeight: 500,
  bodyWeight: 300,
  boldWeight: 600,
  bodyColor: oc.gray[9],
  overrideThemeStyles({ rhythm: r }) {
    return {
      "*": {
        outlineColor: oc.orange[5],
      },
      body: {
        fontSize: r(0.15),
        lineHeight: 1.6,
      },
      // Header Styles
      "h1,h2,h3,h4,h5,h6": {
        marginBottom: r(0.08),
        color: oc.black,
        fontWeight: 300,
      },
      "h5,h6": {
        fontWeight: 500,
      },
      h1: { marginTop: r(0.48), fontSize: r(0.34) },
      h2: { marginTop: r(0.42), fontSize: r(0.3) },
      h3: { marginTop: r(0.34), fontSize: r(0.26) },
      h4: { marginTop: r(0.22), fontSize: r(0.22) },
      h5: { marginTop: r(0.16), fontSize: r(0.18) },
      h6: { marginTop: r(0.16), fontSize: r(0.16) },
      // Paragraph Style
      p: {
        margin: `${r(0.08)} 0 ${r(0.16)}`,
      },
      // Anchor Style
      a: {
        textDecoration: "none",
      },
      // Code Style
      code: {
        lineHeight: "inherit",
      },
      // List Styles
      "ol,ul": {
        margin: `${r(0.08)} 0 ${r(0.16)}`,
      },
      li: {
        margin: 0,
      },
      "li>ol,li>ul": {
        marginLeft: r(0.03),
        marginBottom: r(0.08),
      },
      // Blockquote Style
      blockquote: {
        margin: 0,
        marginLeft: r(0.08),
        color: oc.gray[6],
        fontSize: r(0.15),
        fontWeight: 300,
        fontStyle: "italic",
      },
      // ETC
      img: {
        margin: 0,
      },
      iframe: {
        margin: 0,
      },
      svg: {
        height: "1em",
      },
      ".sans": { fontFamily: sansFontsSerialized },
      ".serif": { fontFamily: serifFontsSerialized },
    } as Style;
  },
});
