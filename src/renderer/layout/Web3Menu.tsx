import React, { useEffect, useState } from 'react';
import { DesktopOutlined, PieChartOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { NavLink } from 'react-router-dom';

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

const items: MenuItem[] = [
  getItem(<NavLink to="/">Home</NavLink>, '1', <PieChartOutlined />),
  getItem(
    <NavLink to="/token-manage">Token Manage</NavLink>,
    '2',
    <DesktopOutlined />
  ),
  getItem(<NavLink to="/upload">Upload</NavLink>, '3', <DesktopOutlined />),
];
const Web3Menu = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {};

  useEffect(() => {
    setTimeout(() => {
      //   setCollapsed(!collapsed);
    }, 1000);
  }, []);

  return (
    <Menu
      selectedKeys={['1']}
      mode="inline"
      theme="dark"
      inlineCollapsed={collapsed}
      items={items}
      className={'w3-menu'}
    />
  );
};
export default Web3Menu;
