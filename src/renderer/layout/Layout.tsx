import React from 'react';
import Web3Router from '../Router';
import Main from './Main';
import Web3Menu from './Web3Menu';
import './style.scss';

const Layout: React.FC = () => {
  return (
    <div className="w3-app">
      <Web3Menu />
      <Main>
        <Web3Router />
      </Main>
    </div>
  );
};

export default Layout;
