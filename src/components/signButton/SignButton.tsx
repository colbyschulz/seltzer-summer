import React, { FC } from 'react';
import { SignImage, SignText } from './signButton.css';
import Sign from '../../assets/images/sign-tan.png';

interface SignButtonProps {
  text: string;
  right?: number;
  top?: string;
  onClick: () => void;
  rotation?: number;
  bottom?: number;
  height?: number;
  rightText?: number;
  bottomText?: number;
  fontSize?: number;
}
const SignButton: FC<SignButtonProps> = ({
  text,
  onClick,
  right = 0,
  rotation = 0,
  bottom = 0,
  height = 100,
  rightText = 0,
  bottomText = 0,
  fontSize = 14,
}) => {
  return (
    <>
      <SignImage
        src={Sign}
        rotation={rotation}
        rightPosition={right}
        bottom={bottom}
        height={height}
        rightText={rightText}
        bottomText={bottomText}
        fontSize={fontSize}
      />

      <SignText
        rotation={rotation}
        rightPosition={right}
        rightText={rightText}
        bottom={bottom}
        height={height}
        bottomText={bottomText}
        fontSize={fontSize}
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
