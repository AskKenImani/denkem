import { useEffect, useState } from 'react';
import API from '../../api/axios';
import socket from '../../socket';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    const { data } = await API.get('/notifications');
    setNotifications(data);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // realtime updates
  useEffect(() => {
    socket.on('notification', (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.off('notification');
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id) => {
    await API.put(`/notifications/${id}/read`);

    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id ? { ...n, read: true } : n
      )
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)}>
        🔔 ({unreadCount})
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            background: '#fff',
            border: '1px solid #ddd',
            width: '300px',
            maxHeight: '400px',
            overflow: 'auto',
          }}
        >
          {notifications.length === 0 && <p>No notifications</p>}

          {notifications.map((n) => (
            <div
              key={n._id}
              style={{
                padding: '10px',
                background: n.read ? '#fff' : '#eef',
                cursor: 'pointer',
              }}
              onClick={() => markAsRead(n._id)}
            >
              <p>{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;