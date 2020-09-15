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
    padding: 2px 4px;
    border: 1px solid ${oc.gray[3]};
    border-radius: 4px;
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
    margin: 16px 0;
    padding: 0;
    font-size: 0.13rem;
    border: 2px solid ${oc.gray[3]};
    border-radius: 8px;
    background-color: ${oc.gray[0]};
    display: flex;
    flex-direction: row-reverse;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 19px;
      background: linear-gradient(to left, ${oc.gray[0]}, ${transparentize(1, oc.gray[0])});
      border-radius: 0 8px 8px 0;
    }
    code[class|="language"] {
      position: initial;
      display: block;
      border: none;
      border-radius: 0;
      background: none;
      margin: 0;
      padding: 3px 5px;
      padding-right: 16px;
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
      padding: 3px 0;
      border-right: 2px solid ${oc.gray[3]};
      background-color: ${oc.gray[3]};
      color: ${oc.gray[7]};
      font-size: inherit;
      flex: none;
      > span::before {
        width: 29px;
        padding: 0;
        padding-right: 6px;
        text-shadow: none;
      }
    }
    span.gatsby-highlight-code-line {
      display: block;
      text-shadow: 1px 0 4px ${oc.yellow[4]}, 0 1px 4px ${oc.yellow[4]}, -1px 0 4px ${oc.yellow[4]},
        0 -1px 4px ${oc.yellow[4]};
    }
  }
  span.gatsby-resp-image-wrapper {
    margin: 12px -12px !important;
    ${ApplyBreaks(
      px =>
        css`
          margin: 12px auto !important;
          border-radius: 8px;
          overflow: hidden;
        `,
      ["sm"]
    )};
  }
  div.gatsby-resp-iframe-wrapper {
    margin: 0.08rem auto !important;
    border-radius: 8px;
  }
  a {
    position: relative;
    background-image: linear-gradient(90deg, ${oc.blue[3]} 0%, ${oc.blue[4]} 100%);
    background-repeat: no-repeat;
    background-size: 100% 0.2em;
    background-position: 0 calc(100% - 0.03rem);
    transition-property: background-size, color, background-position;
    transition-timing-function: ease-in-out;
    transition-duration: 100ms;
    text-shadow: 0 1px 0 white;
    color: inherit;
    @media (hover) {
      &:hover {
        border-radius: 0.03rem;
        background-image: linear-gradient(90deg, ${oc.blue[4]} 0%, ${oc.blue[5]} 100%);
        background-size: 100% 100%;
        background-position: 0 100%;
        text-shadow: none;
        color: ${oc.white};
      }
    }
    &:active {
      background-image: linear-gradient(90deg, ${oc.blue[6]} 0%, ${oc.blue[8]} 100%);
    }
    &.anchor.before,
    &.anchor.after,
    &.gatsby-resp-image-link {
      text-shadow: none;
      background: none;
    }
    &.anchor.before,
    &.anchor.after {
      transform: translateY(-8%);
      margin-left: 0.02rem;
      padding: 0 0.03rem;
      > svg {
        transition: transform ease-in-out 200ms, opacity ease-in-out 200ms;
        visibility: visible;
        transform: translateX(-8px);
        opacity: 0;
      }
    }
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    &:hover a.anchor.before,
    &:hover a.anchor.after,
    a.anchor:focus {
      > svg {
        transform: translateX(0);
        opacity: 1;
      }
    }
  }
  h2 {
    background-image: linear-gradient(90deg, ${oc.gray[9]} 0%, ${oc.gray[8]} 100%);
    background-repeat: no-repeat;
    background-size: 60px 2px;
    background-position: 0 0;
    margin-top: 0.5rem;
    padding-top: 0.1rem;
    padding-bottom: 0.05rem;
    font-size: 0.34rem;
    font-weight: 300;
    color: ${oc.black};
    .anchor {
      color: inherit;
    }
  }

  table {
    display: block;
    width: fit-content;
    max-width: 100%;
    overflow-x: scroll;
    margin: 0.16rem 0 0.24rem;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 8px;
    border: 2px solid ${oc.gray[3]};
    overflow: hidden;
  }
  th {
    border: none;
    background-color: ${oc.gray[3]};
    color: ${oc.gray[7]};
    padding: 8px 12px;
    font-size: 0.14rem;
    font-weight: 500;
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
    border-bottom: 2px solid ${oc.gray[3]};
    padding: 6px 12px;
    vertical-align: top;
    font-size: 0.16rem;
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
    top: -160px;
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
    margin-left: 0.04rem;
    ${ApplyBreaks(
      px =>
        css`
          margin-left: 0;
        `,
      ["sm"]
    )}
  }
  blockquote {
    margin-left: 0.08rem;
  }
  ol,
  ul {
    margin-left: 0.2rem;
    ol,
    ul {
      margin-left: 0.03rem;
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

export default React.memo(MarkdownSection);
