import NotificationBell from '../notifications/NotificationBell';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div style={{ padding: '15px', background: '#fff', borderBottom: '1px solid #ddd' }}>
      <span>Welcome, {user?.name}</span>
      <div style={{ padding: '5px', background: '#f1f1f1', borderBottom: '1px solid #f0a9a9' }}>
        <NotificationBell />
        <button onClick={logout} style={{ float: 'right' }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;