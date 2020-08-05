import React from "react";
import oc from "open-color";
import styled from "../utils/styled-components";

const StyledNoScript = styled.noscript`
  display: block;
  width: fit-content;
  margin: 0.5rem auto;
  padding: 0.667rem 1rem;
  color: ${oc.red[9]};
  background-color: ${oc.red[1]};
  border-radius: 1rem;
  p {
    margin: 0;
    text-align: center;
    font-size: 0.9rem;
    font-weight: 500;
  }
  div {
    margin-top: 0.333rem;
    text-align: center;
    font-size: 0.8rem;
    font-weight: 300;
  }
`;

const NoScript: React.FC = ({ children }) => {
  return (
    <StyledNoScript>
      <p>JavaScript 차단됨</p>
      <div>{children}</div>
    </StyledNoScript>
  );
};

export default NoScript;
