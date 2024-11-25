
'use client'

import "./globals.css";

import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { useState } from 'react';
const { Header, Sider, Content } = Layout;


export default function RootLayout({ children }) {
  
    const [collapsed, setCollapsed] = useState(false);
    const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
  return (
    <html suppressHydrationWarning>
      <body>
    <Layout className="h-full min-h-[100vh]">
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="demo-logo-vertical text-white text-[20px] px-[0] py-[20px] h-[70px] text-center uppercase" >
        Admin Door
      </div>

      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        items={[
          {
            key: '1',
            icon: <HomeOutlined />,
            label: 'Trang chủ',
          },
          {
            key: '2',
            icon: <VideoCameraOutlined />,
            label: 'Quản lý camera',
          },
          {
            key: '3',
            icon: <UserOutlined />,
            label: 'Quản lý camera',
          },
        ]}
      />
    </Sider>
    <Layout>
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
        }}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
      </Header>
      <Content
        style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        {children}
      </Content>
    </Layout>
  </Layout>
  </body>
  </html>
  );
}
