import styled, { createGlobalStyle } from "styled-components";
export * from "styled-components";
export default styled;

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;

export const Breaks = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};
