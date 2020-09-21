import React from "react";
import oc from "open-color";
import styled from "styled-components";

const StyledNoScript = styled.noscript`
  display: block;
  width: fit-content;
  margin: 8px auto;
  padding: 11px 16px;
  color: ${oc.red[9]};
  background-color: ${oc.red[1]};
  border-radius: 16px;
  p {
    margin: 0;
    text-align: center;
    font-size: 0.14rem;
    font-weight: 500;
  }
  div {
    margin-top: 5px;
    text-align: center;
    font-size: 0.13rem;
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
