import React, { FC } from 'react';
import { SignImage, SignText } from './signButton.css';
import Sign from '../../assets/images/sign-tan.png';

interface SignButtonProps {
  text: string;
  right?: string;
  top?: string;
  onClick: () => void;
}
const SignButton: FC<SignButtonProps> = ({ text, onClick }) => {
  return (
    <>
      <SignImage src={Sign} />

      <SignText
        style={{ cursor: 'pointer' }}
        onClick={() => {
          onClick();
        }}
      >
        {text}
      </SignText>
    </>
  );
};

export default SignButton;
