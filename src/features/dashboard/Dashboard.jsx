import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import AdminDashboard from './admin/AdminDashboard';
import StudentDashboard from './student/StudentDashboard';
import TutorDashboard from './tutor/TutorDashboard';
import { useEffect } from 'react';
import socket from '../../socket';


const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user?._id) {
      socket.emit('register', user._id);
    }
  }, []);

  useEffect(() => {
    socket.on('notification', (data) => {
      alert(data.message);
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar user={user} />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: '20px' }}>
          {user.role === 'admin' && <AdminDashboard />}
          {user.role === 'tutor' && <TutorDashboard />}
          {user.role === 'student' && <StudentDashboard />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;