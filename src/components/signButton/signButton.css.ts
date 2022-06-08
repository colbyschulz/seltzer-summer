import styled from 'styled-components';

interface SignProps {
  rightPosition: number;
  rotation: number;
  bottom: number;
  height: number;
  rightText: number;
  bottomText: number;
  fontSize: number;
}

export const SignImage = styled.img<SignProps>`
  position: absolute;
  transform: rotate(${({ rotation }) => rotation}deg);
  right: ${({ rightPosition }) => rightPosition}px;
  height: ${({ height }) => height}px;
  bottom: ${({ bottom }) => bottom}px;

  @media (max-width: 415px) {
    right: ${({ rightPosition }) => rightPosition}px;
    height: ${({ height }) => height}px;
  }
`;

export const SignText = styled.button<SignProps>`
  position: absolute;
  cursor: pointer;
  padding: 10px;
  transform: rotate(${({ rotation }) => rotation}deg);
  right: ${({ rightText }) => rightText}px;
  bottom: ${({ bottomText }) => bottomText}px;
  font-size: ${({ fontSize }) => fontSize}px;
  background-color: transparent;

  @media (max-width: 415px) {
    bottom: ${({ bottomText }) => bottomText}px;
    right: ${({ rightText }) => rightText}px;

    font-size: ${({ fontSize }) => fontSize}px;
  }
`;
