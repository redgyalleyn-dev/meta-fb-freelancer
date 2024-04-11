import React from 'react';
import { Result } from 'antd';


const PageNotFound = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }}>
    <Result
      status="error"
      title="Page Not Found"
      subTitle="Please redirect to /meta-community-standard"
    >
    </Result>
  </div>
);

export default PageNotFound;