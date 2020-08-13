import React from "react";
import styled from "styled-components";
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
    font-size: 0.9rem;
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
  }
`;

type Props = {
  html: string;
};

const MarkdownSection: React.FC<Props> = ({ html }) => {
  return <Section dangerouslySetInnerHTML={{ __html: html }} />;
};

export default MarkdownSection;
