import React, { FC } from 'react';
import { StyledButton } from './button.css';

interface ButtonProps {
  style?: Record<string, string | number>;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  transparent?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

const Button: FC<ButtonProps> = ({ style, children, onClick, transparent, type = 'button' }) => (
  <StyledButton onClick={onClick} style={style} transparent={transparent} type={type}>
    {children}
  </StyledButton>
);

export default Button;
