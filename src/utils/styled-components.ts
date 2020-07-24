import styled, { createGlobalStyle, css, FlattenSimpleInterpolation } from "styled-components";
export * from "styled-components";
export default styled;

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;

type BreakNames = "sm" | "md" | "lg" | "xl";
export const breaks: { [breakName in BreakNames]: number } = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export function ApplyBreaks(
  callbackfn: (breakValue: number) => FlattenSimpleInterpolation,
  excludes?: BreakNames[] | undefined
) {
  return css`
    ${Object.keys(breaks)
      .filter(breakName => !excludes?.includes(breakName as BreakNames))
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
