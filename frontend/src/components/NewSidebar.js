import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// A simple icon component. In a real app, you'd use a library like react-icons.
const Icon = ({ name }) => {
  // This is a basic placeholder. You can replace it with actual SVG icons.
  const icons = {
    Dashboard: '🏠',
    Services: '🛠️',
    Orders: '📦',
    Wallet: '💰',
    Support: '💬',
    Settings: '⚙️',
  };
  return <span style={{ marginRight: '10px' }}>{icons[name] || '●'}</span>;
};

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Services', path: '/services' },
  { name: 'Orders', path: '/my-orders' },
  { name: 'Wallet', path: '/wallet' },
  { name: 'Support', path: '/support' },
  { name: 'Settings', path: '/settings' },
];

const NewSidebar = () => {
  const location = useLocation();

  const sidebarStyle = {
    width: '250px',
    background: '#2c3e50',
    color: 'white',
    height: '100vh',
    padding: '20px',
    boxSizing: 'border-box',
  };

  const logoStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '40px',
  };

  const navListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const navItemStyle = {
    marginBottom: '15px',
  };

  const linkStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    color: isActive ? '#3498db' : 'white',
    textDecoration: 'none',
    padding: '12px 15px',
    borderRadius: '8px',
    transition: 'background 0.3s, color 0.3s',
    background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
  });

  const handleMouseOver = (e) => {
    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
  };

  const handleMouseOut = (e, isActive) => {
    e.currentTarget.style.background = isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent';
  };

  return (
    <div style={sidebarStyle}>
      <div style={logoStyle}>PlutoBoost</div>
      <ul style={navListStyle}>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <li key={item.name} style={navItemStyle}>
              <Link
                to={item.path}
                style={linkStyle(isActive)}
                onMouseOver={handleMouseOver}
                onMouseOut={(e) => handleMouseOut(e, isActive)}
              >
                <Icon name={item.name} />
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NewSidebar;