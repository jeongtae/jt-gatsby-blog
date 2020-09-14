import React, { useState } from "react";
import styled from "styled-components";
import oc from "open-color";
import { uniqueId } from "lodash";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Container = styled.div`
  display: block;
  height: fit-content;
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
    .text {
      font-size: 0.12rem;
      font-weight: 500;
      white-space: pre;
    }
    .icon {
      margin-left: 0.03rem;
    }
  }
  input:focus + label {
    outline: auto;
    outline-color: inherit;
  }
  input:checked + label {
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

const TextSwitch: React.FC<{
  id?: string;
  defaultText: string;
  defaultIcon?: IconDefinition;
  checkedText: string;
  checkedIcon?: IconDefinition;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}> = ({
  id = "",
  defaultText,
  defaultIcon = null,
  checkedText,
  checkedIcon = null,
  checked = false,
  onChange = () => {},
}) => {
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
        {checked ? (
          <div className="default">
            <span className="text">{defaultText}</span>
            {defaultIcon && <FontAwesomeIcon className="icon" icon={defaultIcon} />}
          </div>
        ) : (
          <div className="checked">
            <span className="text">{checkedText}</span>
            {checkedIcon && <FontAwesomeIcon className="icon" icon={checkedIcon} />}
          </div>
        )}
      </label>
    </Container>
  );
};

export default TextSwitch;
