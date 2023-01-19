import React from 'react';
import Web3Router from '../Router';
import Main from './Main';
import Header from './Header';
import Background from './Background';
import './_style.scss';

const Layout: React.FC = () => {
  return (
    <div className="w3-app">
      <Background />
      <Header />
      <Main>
        <Web3Router />
      </Main>
    </div>
  );
};

export default Layout;
