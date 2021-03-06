import React from "react";
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
`;

const Input = styled.input.attrs({ type: 'number' })`
  background-color: transparent;
  color: inherit;
  font-size: inherit;
  font-family: inherit;
  width: 100%;
  margin: 0;
  padding: 0;
  border: none;
  transition-duration: 0.2s;
  -moz-appearance: textfield;
  &::-webkit-inner-spin-button {
    appearance: none;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    padding-left: 5px;
    border-radius: 2px;
  }
  &:focus {
    background-color: rgba(255, 255, 255, 0.1);
    padding-left: 5px;
    border-radius: 2px;
    outline: none;
    border: none;
  }
`;

const InputNumberSmall: React.FC<{
  name: string,
  min?: string | number,
  max?: string | number,
  value?: string | number | readonly string[]
  onChange?: React.ChangeEventHandler<HTMLInputElement>,
  onBlur?: React.FocusEventHandler<HTMLInputElement>,
}> = (props) => {
  return (
    <Wrapper>
      <span style={{ whiteSpace: 'nowrap' }}>{props.name}:&nbsp;</span>
      <Input
        {...props}
      />
    </Wrapper>
  );
};

export default InputNumberSmall;