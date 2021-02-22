import React from 'react';
import ReactDOM from 'react-dom';
import './client/scss/index.scss';
import App from './client/common/components/common.app';
import "@fluentui/react/dist/css/fabric.min.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
