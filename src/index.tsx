import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store/index';
import { Provider } from 'react-redux'
import { Helmet } from 'react-helmet';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    {/* <Helmet>
      <meta name="description" content="Mô tả của trang web" />
      <meta property="og:title" content="Tiêu đề khi chia sẻ trang web" />
      <meta property="og:description" content="Mô tả khi chia sẻ trang web" />
      <meta property="og:image" content="https://congdankhuyenhoc.qltns.mediacdn.vn/449484899827462144/2022/7/29/meta1-20220728150225-1659067146273664135586.jpg" />
    </Helmet> */}
    <App />
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
