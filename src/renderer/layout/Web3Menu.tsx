import React, { useEffect, useState } from 'react';
import { DesktopOutlined, PieChartOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import './_style.scss';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const Web3Menu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKeys, setActiveKeys] = useState(['home']);
  const location = useLocation();

  useEffect(() => {
    let pathname = location.pathname;
    if (pathname === '/') pathname = '/home';
    pathname = pathname.substring(1);
    setActiveKeys([pathname]);
  }, [location]);

  const toggleCollapsed = () => {};

  useEffect(() => {
    setTimeout(() => {
      setCollapsed(!collapsed);
    }, 1000);
  }, []);

  const items: MenuItem[] = [
    getItem(<NavLink to="/">Home</NavLink>, 'home', <PieChartOutlined />),
    getItem(
      <NavLink to="/token">Token Manage</NavLink>,
      'token',
      <DesktopOutlined />
    ),
    getItem(
      <NavLink to="/upload">Upload</NavLink>,
      'upload',
      <DesktopOutlined />
    ),
  ];

  return (
    <Menu
      selectedKeys={activeKeys}
      mode="horizontal"
      theme="dark"
      items={items}
      className={'w3-menu'}
      id={'w3-menu'}
    />
  );
};
export default Web3Menu;
