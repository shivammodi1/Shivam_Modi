import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#020408', color: 'white' }}>
      <Navigation />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;