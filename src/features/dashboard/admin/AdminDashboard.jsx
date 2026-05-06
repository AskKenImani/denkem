import { useEffect, useState } from 'react';
import API from '../../../api/axios';
import Card from '../../../components/ui/Card';
import { User } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [payments, setPayments] = useState([]);
  const [requests, setRequests] = useState([]);

  const [analytics, setAnalytics] = useState({});

  const fetchAnalytics = async () => {
    const { data } = await API.get('/admin/analytics');
    setAnalytics(data);
  };

  const updateStatus = async (id, status) => {
    await API.put(`/tutors/${id}/status`, { status });
    fetchData();
  };

  const fetchRequests = async () => {
    const { data } = await API.get('/requests');
    setRequests(data);
  };

  useEffect(() => {
    fetchData();
    fetchRequests();
    fetchAnalytics();
  }, []);

  const fetchData = async () => {
    const usersRes = await API.get('/admin/users');
    const tutorRes = await API.get('/admin/tutors');
    const paymentRes = await API.get('/admin/payments');

    setUsers(usersRes.data);
    setTutors(tutorRes.data);
    setPayments(paymentRes.data);
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    await API.delete(`/admin/users/${id}`);
    fetchData();
  };

  const deleteTutor = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    await API.delete(`/admin/tutors/${id}`);
    fetchData();
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    
    await API.delete(`/admin/requests/${id}`);
    fetchRequests();
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <Card>
        <h3>Analytics</h3>
        <p>Total Users: {analytics.users}</p>
        <p>Total Tutors: {analytics.tutors}</p>
        <p>Total Requests: {analytics.requests}</p>
        <p>Total Payments: {analytics.payments}</p>
      </Card>

      {/* USERS */}
      <Card>
        <h3>Users</h3>
        {users.map((u) => (
          <div key={u._id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span> {u.name} - {u.email} ({u.role}) </span>
            <button onClick={() => deleteUser(u._id)}>Delete</button>
          </div>
        ))}
      </Card>

      <hr />

      {/* TUTOR APPLICATIONS */}
      <Card>
        <h3>Tutor Applications</h3>
        {tutors.map((t) => (
            <div key={t._id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span> {t.user?.name} - {t.status} </span>
              <div>
                {t.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(t._id, 'approved')}>
                      Approve
                    </button>

                    <button onClick={() => updateStatus(t._id, 'rejected')}>
                      Reject
                    </button>
                  </>
                )}
                <button onClick={() => deleteTutor(t._id)}>Delete</button>

              </div>

            </div>
        ))}
      </Card>

      <hr />

      {/* PAYMENTS */}
      <Card>
        <h3>Payments</h3>
        {payments.map((p) => (
          <div key={p._id}>
            {p.user?.name} paid ₦{p.amount} ({p.status})
          </div>
        ))}
      </Card>

      <hr />

      <Card>
        <h3>Tutor Requests</h3>

        {requests.map((r) => (
          <div key={r._id}  style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", borderBottom: "1px solid #ccc", paddingBottom: "8px" }}>
            <div>
              <p>Student: {r.student?.name}</p>
              <p>Tutor: {r.tutor?.name}</p>
              <p>Subject: {r.subject}</p>
              <p>Status: {r.status}</p>
              <p>{new Date(r.createdAt).toLocaleString()}</p>

              {r.status === 'accepted' && r.meetingLink && (
                <button onClick={() => window.open(r.meetingLink, '_blank')}>
                  Join Session
                </button>
              )}
            </div>

            <button onClick={() => deleteRequest(r._id)}>
              Delete
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default AdminDashboard;