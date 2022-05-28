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
    min-height: -webkit-fill-available;
   
    max-height: 100vh;
    max-height: -webkit-fill-available;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
  }

  button {
    border: none;
  }

  input {
    outline:0 !important;
    border-left: 0 !important;
    border-right: 0 !important;
    border-radius: 0 !important;
    border-top: 0 !important;

    // -webkit-appearance: none;
    box-shadow: none !important;
  }
  input:focus {outline:none}


  input::-webkit-calendar-picker-indicator{
    display: none;
}
`;
