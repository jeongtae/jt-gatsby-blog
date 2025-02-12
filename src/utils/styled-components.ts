import { createGlobalStyle, css, FlattenSimpleInterpolation } from "styled-components";

// @ts-ignore
import animista from "!!raw-loader!./animista.css";

export const GlobalStyle = createGlobalStyle`
  ${animista};
  * {
    box-sizing: border-box;
  }
  img {
    -ms-interpolation-mode: bicubic;
  }
  html {
    line-height: unset;
  }
  .tl-wrapper {
    background-color: white;
  }
`;

type BreakNames = "sm" | "md" | "lg" | "xl" | "xxl";
export const breaks: { [breakName in BreakNames]: number } = {
  sm: 640,
  md: 768,
  lg: 1000,
  xl: 1300,
  xxl: 1600,
};

export function ApplyBreaks(
  callbackfn: (breakPx: number) => FlattenSimpleInterpolation,
  includingBreaks?: BreakNames[] | undefined
) {
  return css`
    ${Object.keys(breaks)
      .filter(breakName => includingBreaks?.includes(breakName as BreakNames) ?? true)
      .map(
        breakName =>
          css`
            @media only screen and (min-width: ${breaks[breakName]}px) {
              ${callbackfn(breaks[breakName])}
            }
          `
      )}
  `;
}
