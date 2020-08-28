import React, { useRef, useLayoutEffect } from "react";
import styled, { ApplyBreaks, css } from "../utils/styled-components";
import { transparentize } from "polished";
import oc from "open-color";

// @ts-ignore
import prism from "!!raw-loader!./prism.css";

const Section = styled.section`
  ${prism};
  code[class|="language"] {
    display: inline;
    padding: 0.1rem 0.25rem;
    border: 1px solid ${oc.gray[3]};
    border-radius: 0.25rem;
    background-color: ${oc.gray[0]};
    font-size: 0.9em;
    font-weight: 400;
    text-shadow: none;
    white-space: normal;
    color: inherit;
  }
  pre[class|="language"].line-numbers {
    display: block;
    position: relative;
    margin: 0;
    padding: 0;
    font-size: 0.8rem;
    border: 2px solid ${oc.gray[3]};
    border-radius: 0.5rem;
    background-color: ${oc.gray[0]};
    display: flex;
    flex-direction: row-reverse;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 1.2rem;
      background: linear-gradient(to left, ${oc.gray[0]}, ${transparentize(1, oc.gray[0])});
      border-radius: 0 0.5rem 0.5rem 0;
    }
    code[class|="language"] {
      position: initial;
      display: block;
      border: none;
      border-radius: 0;
      background: none;
      margin: 0;
      padding: 0.2rem 0.3rem;
      padding-right: 1rem;
      font-size: inherit;
      text-shadow: none;
      overflow: scroll;
      flex: 1;
      color: inherit;
      &::selection,
      span::selection {
        background-color: ${oc.gray[3]};
      }
    }
    span.line-numbers-rows {
      position: initial;
      display: block;
      margin: 0;
      padding: 0.2rem 0;
      border-right: 2px solid ${oc.gray[3]};
      background-color: ${oc.gray[3]};
      color: ${oc.gray[7]};
      font-size: inherit;
      flex: none;
      > span::before {
        width: 1.8rem;
        padding: 0;
        padding-right: 0.4rem;
        text-shadow: none;
      }
    }
    span.gatsby-highlight-code-line {
      display: block;
      text-shadow: 0 0 0.2rem ${oc.yellow[4]};
      &::selection,
      span::selection {
        background-color: ${oc.red[3]};
      }
    }
  }
  span.gatsby-resp-image-wrapper {
    margin: 0.5rem -0.75rem;
    ${ApplyBreaks(
      px =>
        css`
          margin: 0.5rem auto;
          border-radius: 0.5rem;
          overflow: hidden;
        `,
      ["sm"]
    )};
  }
  iframe.embedVideo-iframe {
    border-radius: 0.5rem;
  }
  a {
    text-decoration: none;
    position: relative;
    background-image: linear-gradient(90deg, ${oc.blue[3]} 0%, ${oc.blue[4]} 100%);
    background-repeat: no-repeat;
    background-size: 100% 0.2em;
    background-position: 0 90%;
    transition: background-size ease-in-out 100ms, color ease-in-out 100ms;
    text-shadow: 0 0.075rem 0 white;
    color: inherit;
    @media (hover) {
      &:hover {
        border-radius: 0.2rem;
        background-image: linear-gradient(90deg, ${oc.blue[4]} 0%, ${oc.blue[5]} 100%);
        background-size: 100% 100%;
        text-shadow: none;
        color: ${oc.white};
      }
    }
    &:active {
      background-image: linear-gradient(90deg, ${oc.blue[6]} 0%, ${oc.blue[8]} 100%);
    }
    &.anchor.before,
    &.gatsby-resp-image-link {
      text-shadow: none;
      background: none;
    }
  }
  table {
    display: table;
    width: auto;
    margin: 1rem 0 1.5rem;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 0.5rem;
    border: 2px solid ${oc.gray[3]};
    overflow: hidden;
  }
  th {
    border: none;
    background-color: ${oc.gray[3]};
    color: ${oc.gray[7]};
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
    line-height: 1.5;
    &[align="center"] {
      text-align: center;
    }
    &[align="left"] {
      text-align: left;
    }
    &[align="right"] {
      text-align: right;
    }
  }
  tr {
    transition: background-color ease-in-out 100ms;
    background-color: ${oc.gray[0]};
    &:hover {
      background-color: white;
    }
    &:last-child td {
      border-bottom: none;
    }
  }
  td {
    border: none;
    border-bottom: 1px solid ${oc.gray[3]};
    padding: 0.4rem 0.75rem;
    vertical-align: top;
    font-size: 1rem;
    line-height: 1.5;
    &[align="center"] {
      text-align: center;
    }
    &[align="left"] {
      text-align: left;
    }
    &[align="right"] {
      text-align: right;
    }
    &[rowspan] {
      vertical-align: middle;
    }
  }
  div.hidden-heading-anchor {
    position: relative;
    height: 0;
    top: -10rem;
    visibility: hidden;
    &:target {
      + h2,
      + h3,
      + h4,
      + h5,
      + h6 {
        animation: shake-horizontal 0.8s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
      }
    }
  }
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-left: 0.75rem;
    font-weight: 500;
    ${ApplyBreaks(
      px =>
        css`
          margin-left: 0;
        `,
      ["sm"]
    )}
  }
  h2 {
    font-size: 1.6rem;
  }
  h3 {
    font-size: 1.4rem;
  }
  h4 {
    font-size: 1.2rem;
  }
  h5 {
    font-size: 1rem;
    font-weight: 700;
  }
  h6 {
    font-size: 0.9rem;
    font-weight: 700;
  }
`;

type Props = {
  html: string;
  ref: React.Ref<HTMLElement>;
};

const MarkdownSection: React.FC<Props> = React.forwardRef(({ html }, ref) => {
  let markdownRef = useRef<HTMLElement>();
  if (ref) markdownRef = ref as any;
  useLayoutEffect(() => {
    const markdown = markdownRef.current;
    const appendedHiddenElements: HTMLElement[] = [];
    markdown.querySelectorAll("h2, h3, h4, h5, h6").forEach(heading => {
      const hiddenElement = document.createElement("div");
      hiddenElement.id = heading.id;
      hiddenElement.classList.add("hidden-heading-anchor");
      heading.parentElement.insertBefore(hiddenElement, heading);
      appendedHiddenElements.push(hiddenElement);
    });
    return () => {
      appendedHiddenElements.forEach(element => element.remove());
      appendedHiddenElements.length = 0;
    };
  }, []);
  return <Section ref={markdownRef} dangerouslySetInnerHTML={{ __html: html }} />;
});

export default MarkdownSection;
