import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  html { height:100%; }
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', Open-Sans, Helvetica, Sans-Serif;
    width: 100%;
    min-height: 100%;
  }

 

  #root {
    min-height: 100vh;
    width: 100vw;
  }

  button {
    border: none;
    background-color: transparent;
  }
`;
