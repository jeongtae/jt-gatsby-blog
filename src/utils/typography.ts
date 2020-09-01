import { CSSProperties } from "react";
import oc from "open-color";
import Typography from "typography";
import wordpressTheme from "typography-theme-wordpress-2014";

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
  ...wordpressTheme,
  baseFontSize: `10px`,
  baseLineHeight: 1.6,
  bodyColor: oc.gray[9],
  googleFonts: [
    {
      /* https://fonts.google.com/specimen/Noto+Sans+KR */
      /* 100 300 400 500 700 900 */
      name: "Noto Sans KR",
      styles: ["300", "500", "700"],
    },
    {
      /* https://fonts.google.com/specimen/Noto+Serif+KR */
      /* 200 300 400 500 600 700 900 */
      name: "Noto Serif KR",
      styles: ["300", "500", "600"],
    },
  ],
  headerFontFamily: sansFonts,
  headerWeight: 500,
  bodyFontFamily: sansFonts,
  bodyWeight: 300,
  boldWeight: 600,
  overrideThemeStyles({ rhythm }, options) {
    return {
      body: { fontSize: "1.5rem" },
      ".sans": { fontFamily: sansFontsSerialized },
      ".serif": { fontFamily: serifFontsSerialized },
    } as Style;
  },
});
