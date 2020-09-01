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
    padding: 0.2rem 0.4rem;
    border: 0.1rem solid ${oc.gray[3]};
    border-radius: 0.4rem;
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
    margin: 1.6rem 0;
    padding: 0;
    font-size: 1.3rem;
    border: 0.2rem solid ${oc.gray[3]};
    border-radius: 0.8rem;
    background-color: ${oc.gray[0]};
    display: flex;
    flex-direction: row-reverse;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 1.9rem;
      background: linear-gradient(to left, ${oc.gray[0]}, ${transparentize(1, oc.gray[0])});
      border-radius: 0 0.8rem 0.8rem 0;
    }
    code[class|="language"] {
      position: initial;
      display: block;
      border: none;
      border-radius: 0;
      background: none;
      margin: 0;
      padding: 0.3rem 0.5rem;
      padding-right: 1.6rem;
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
      padding: 0.3rem 0;
      border-right: 0.2rem solid ${oc.gray[3]};
      background-color: ${oc.gray[3]};
      color: ${oc.gray[7]};
      font-size: inherit;
      flex: none;
      > span::before {
        width: 2.9rem;
        padding: 0;
        padding-right: 0.6rem;
        text-shadow: none;
      }
    }
    span.gatsby-highlight-code-line {
      display: block;
      text-shadow: 0 0 0.3rem ${oc.yellow[4]};
      &::selection,
      span::selection {
        background-color: ${oc.red[3]};
      }
    }
  }
  span.gatsby-resp-image-wrapper {
    margin: 0.8rem -1.2rem;
    ${ApplyBreaks(
      px =>
        css`
          margin: 0.8rem auto;
          border-radius: 0.8rem;
          overflow: hidden;
        `,
      ["sm"]
    )};
  }
  iframe.embedVideo-iframe {
    border-radius: 0.8rem;
  }
  a {
    text-decoration: none;
    position: relative;
    background-image: linear-gradient(90deg, ${oc.blue[3]} 0%, ${oc.blue[4]} 100%);
    background-repeat: no-repeat;
    background-size: 100% 0.2em;
    background-position: 0 90%;
    transition: background-size ease-in-out 100ms, color ease-in-out 100ms;
    text-shadow: 0 0.1rem 0 white;
    color: inherit;
    @media (hover) {
      &:hover {
        border-radius: 0.3rem;
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
    margin: 1.6rem 0 2.4rem;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 0.8rem;
    border: 0.2rem solid ${oc.gray[3]};
    overflow: hidden;
  }
  th {
    border: none;
    background-color: ${oc.gray[3]};
    color: ${oc.gray[7]};
    padding: 0.8rem 1.2rem;
    font-size: 1.4rem;
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
    border-bottom: 0.2rem solid ${oc.gray[3]};
    padding: 0.6rem 1.2rem;
    vertical-align: top;
    font-size: 1.6rem;
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
    top: -16rem;
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
    margin-left: 1.2rem;
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
    margin-top: 3.8rem;
    font-size: 3.2rem;
  }
  h3 {
    margin-top: 3.2rem;
    font-size: 2.4rem;
  }
  h4 {
    margin-top: 2.1rem;
    margin-bottom: 0.8rem;
    font-size: 1.9rem;
  }
  h5 {
    margin-top: 1.6rem;
    margin-bottom: 0.8rem;
    font-size: 1.6rem;
    font-weight: 700;
  }
  h6 {
    margin-top: 1.6rem;
    margin-bottom: 0.8rem;
    font-size: 1.4rem;
    font-weight: 700;
  }
  p {
    margin-top: 0.8rem;
    margin-bottom: 1.6rem;
  }
  blockquote {
    font-size: 1.6rem;
    margin-left: 0.8rem;
  }
  ol,
  ul {
    margin: 0.8rem 0;
    margin-left: 2rem;
    ol,
    ul {
      margin-top: 0;
    }
    li {
      margin-bottom: 0.4rem;
    }
    p {
      margin: 0;
    }
  }
  strong code {
    font-weight: 500 !important;
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
