import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/public.scss';
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode></React.StrictMode>,
  <ConfigProvider
    locale={zhCN}
  >
    <App />
  </ConfigProvider>
);
