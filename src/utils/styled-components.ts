import styled, { createGlobalStyle, css, FlattenSimpleInterpolation } from "styled-components";
export * from "styled-components";
export default styled;

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  img {
    -ms-interpolation-mode: bicubic;
  }
  html {
    line-height: unset;
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
  callbackfn: (breakValue: number) => FlattenSimpleInterpolation,
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
