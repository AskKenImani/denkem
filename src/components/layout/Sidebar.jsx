const Sidebar = ({ user }) => {
  return (
    <div style={{
      width: '240px',
      background: '#1e293b',
      color: '#fff',
      padding: '20px',
      minHeight: '100vh'
    }}>
      <h2>EduPlatform</h2>

      <p style={{ marginTop: '20px', color: '#94a3b8' }}>MENU</p>

      {user.role === 'admin' && <p>Dashboard</p>}
      {user.role === 'student' && <p>Materials</p>}
      {user.role === 'tutor' && <p>My Application</p>}
    </div>
  );
};

export default Sidebar;