import { useState } from 'react';
import API from '../../../api/axios';
import { useEffect } from 'react';
import Card from '../../../components/ui/Card';

const TutorDashboard = () => {

  const [requests, setRequests] = useState([]);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data } = await API.get('/requests');
    setRequests(data);
  };

  const updateStatus = async (id, status) => {
    if (!window.confirm("Are you sure you want to proceed?")) return;

    await API.put(`/requests/${id}`, { status });
    fetchRequests();
  };


  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const { data } = await API.get('/tutors/me');
      setApplication(data);
    } catch {}
  };

  // if (application) {
  //   return (
  //     <div>
  //       <h2>Tutor Application</h2>
  //       <p>Status: {application.status}</p>

  //       {application.status === 'pending' && <p>Waiting for approval...</p>}
  //       {application.status === 'approved' && <p>You are now a tutor 🎉</p>}
  //       {application.status === 'rejected' && <p>Application rejected</p>}
  //     </div>
  //   );
  // }


  return (
    <div>
      <Card>
        <h2>Incoming Requests</h2>

        {requests.map((r) => (
          <div key={r._id}>
            <p>{r.subject}</p>
            <p>{r.schedule}</p>
            <p>{r.student?.name}</p>
            <p><strong>Date:</strong> {new Date(r.sessionDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {r.timeSlot}</p>
            <p>Status: {r.status}</p>

            {r.status === 'pending' && (
              <>
                <button onClick={() => updateStatus(r._id, 'accepted')}>
                  Accept
                </button>

                <button onClick={() => updateStatus(r._id, 'rejected')}>
                  Reject
                </button>
              </>
            )}

            {r.status === 'accepted' && r.meetingLink && (
              <button onClick={() => window.open(r.meetingLink, '_blank')}>
                Start Session
              </button>
            )}

          </div>
        ))}
      </Card>
    </div>
  );
};

export default TutorDashboard;