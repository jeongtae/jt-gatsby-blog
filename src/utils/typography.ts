import { CSSProperties } from "react";
import oc from "open-color";
import Typography from "typography";
import wordpressTheme from "typography-theme-wordpress-2014";

interface Style {
  [selector: string]: CSSProperties;
}

export default new Typography({
  ...wordpressTheme,
  baseFontSize: "18px",
  baseLineHeight: 1.5,
  bodyColor: oc.gray[9],
  googleFonts: [],
  headerFontFamily: [
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
  ],
  headerWeight: 600,
  bodyFontFamily: [
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
  ],
  bodyWeight: 300,
  boldWeight: 600,
  overrideThemeStyles({ rhythm }, options) {
    return {
      "h1,h2": { color: "red" },  // test
    } as Style;
  },
});
