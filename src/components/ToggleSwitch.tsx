import React, { useState } from "react";
import styled from "styled-components";
import oc from "open-color";
import { uniqueId } from "lodash";

const Container = styled.div`
  label {
    padding: 0.02rem 0.06rem;
    display: inline-flex;
    align-items: center;
    font-size: 0.12rem;
    font-weight: 500;
    user-select: none;
    transition: background-color 100ms ease-in-out;
    border-radius: 0.08rem;
    cursor: pointer;
    @media (hover) {
      &:hover {
        background-color: ${oc.gray[1]};
      }
    }
    .icon {
      position: relative;
      display: inline-block;
      margin-left: 0.03rem;
      width: 0.2rem;
      height: 0.13rem;
      border-radius: 1rem;
      background-color: ${oc.gray[5]};
      transition: background-color 100ms ease-in-out;
      &::before {
        content: "";
        position: absolute;
        top: 0.01rem;
        left: 0.01rem;
        width: 0.11rem;
        height: 0.11rem;
        border-radius: 1rem;
        background-color: ${oc.white};
        transition: transform 100ms ease-in-out;
      }
    }
    &:active .icon::before {
      transform: translateX(0.02rem);
      transition-timing-function: ease-in;
      transition-duration: 60ms;
      transition-delay: 100ms;
    }
  }
  input:focus + label {
    outline: auto;
    outline-color: inherit;
  }
  input:checked + label {
    .icon {
      background-color: ${oc.orange[5]};
      &::before {
        transform: translateX(0.07rem);
      }
    }
    &:active .icon::before {
      transform: translateX(0.05rem);
    }
  }
`;

const HiddenInput = styled.input`
  opacity: 0;
  position: absolute;
  pointer-events: none;
`;

const labelClickHandler: React.MouseEventHandler<HTMLLabelElement> = e => {
  e.preventDefault();
  e.currentTarget.control?.click();
};

const ToggleSwitch: React.FC<{
  id?: string;
  text?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}> = ({ id = "", text = "", checked: checked = false, onChange = () => {} }) => {
  const [generatedId] = useState(uniqueId());
  id = id || generatedId;

  return (
    <Container>
      <HiddenInput
        type="checkbox"
        id={id}
        checked={checked}
        onChange={e => onChange(e.currentTarget.checked)}
      />
      <label htmlFor={id} onClick={labelClickHandler}>
        <span>{text}</span>
        <div aria-hidden={true} className="icon" />
      </label>
    </Container>
  );
};

export default ToggleSwitch;
