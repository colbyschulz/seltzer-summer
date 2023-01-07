import React, { FC, MouseEventHandler } from 'react';
import { StyledButton } from './button.css';

interface ButtonProps {
  type?: 'link' | 'text' | 'default' | 'ghost' | 'primary' | 'dashed';
  children: React.ReactNode;
  style?: any;
  onClick?: (MouseEventHandler<HTMLAnchorElement> & MouseEventHandler<HTMLButtonElement>) | undefined;
  htmlType?: 'button' | 'submit' | 'reset';
}
const Button: FC<ButtonProps> = ({ type, children, style, htmlType, onClick }) => (
  <StyledButton style={style} type={type} htmlType={htmlType} onClick={onClick}>
    {children}
  </StyledButton>
);

export default Button;
