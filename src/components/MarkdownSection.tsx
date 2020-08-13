import React from "react";
import styled from "styled-components";
import oc from "open-color";

// @ts-ignore
import prism from "!!raw-loader!./prism.css";

const Section = styled.section`
  ${prism};

  pre[class*="language-"].line-numbers {
    display: block;
    position: initial;
    margin: 0;
    padding: 0;
    font-size: 0.8rem;
    border: 2px solid ${oc.gray[3]};
    border-radius: 0.5rem;
    background-color: ${oc.gray[0]};
    display: flex;
    flex-direction: row-reverse;
    code[class*="language-"] {
      position: initial;
      display: block;
      margin: 0;
      padding: 0.2rem 0.3rem;
      font-size: inherit;
      text-shadow: none;
      overflow: scroll;
      flex-grow: 1;
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
