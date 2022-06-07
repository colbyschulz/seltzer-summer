import { createGlobalStyle } from 'styled-components';
import Crumpled1 from './assets/images/crumpled1.jpg';
export default createGlobalStyle`
  * {
    font-family: 'Walter Turncoat', Open-Sans, Helvetica, Sans-Serif !important;
  }
  html, body {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    overscroll-behavior-y: none;
    margin: 0;
    padding: 0;
    
  #root {
    background-image: url(${Crumpled1});
    background-size: cover;
    min-height: 100vh;
    // for mobile notches
    min-height: -webkit-fill-available;
    max-height: 100vh;
    max-height: -webkit-fill-available;
    height: 100vh;
    margin: auto;
    width: 100vw;
    max-width: 2000px;
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
    
    box-shadow: none !important;
  }

  input:focus {outline:none}

  input::-webkit-calendar-picker-indicator{
    display: none;
  }
`;
