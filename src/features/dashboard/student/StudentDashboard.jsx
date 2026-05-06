import { useEffect, useState } from 'react';
import API from '../../../api/axios';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [materials, setMaterials] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [reviews, setReviews] = useState({});

  const [request, setRequest] = useState({
    subject: '',
    message: '',
    tutorId: '',
    sessionDate: '',
    timeSlot: '',
  });

  useEffect(() => {
    fetchMaterials();
    fetchTutors();
    fetchMyRequests();
  }, []);

  // ========================
  // FETCH MATERIALS
  // ========================
  const fetchMaterials = async () => {
    try {
      const { data } = await API.get('/materials');
      setMaterials(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ========================
  // FETCH TUTORS + RATINGS
  // ========================
  const fetchTutors = async () => {
    try {
      const { data } = await API.get('/users/tutors');

      const tutorsWithRatings = await Promise.all(
        data.map(async (t) => {
          try {
            const res = await API.get(`/reviews/rating/${t._id}`);
            return { ...t, ...res.data };
          } catch {
            return { ...t, avgRating: 0, total: 0 };
          }
        })
      );

      setTutors(tutorsWithRatings);
    } catch (err) {
      console.log('Tutor fetch error:', err);
    }
  };

  // ========================
  // FETCH REQUESTS
  // ========================
  const fetchMyRequests = async () => {
    try {
      const { data } = await API.get('/requests');
      setMyRequests(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ========================
  // CREATE REQUEST
  // ========================
  const handleRequest = async (e) => {
    e.preventDefault();

    if (!window.confirm('Proceed with request?')) return;

    try {
      await API.post('/requests', request);
      alert('Request sent');
      fetchMyRequests();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // ========================
  // REVIEW HANDLING
  // ========================
  const handleReviewChange = (id, field, value) => {
    setReviews((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const submitReview = async (requestId) => {
    try {
      const data = reviews[requestId];

      if (!data?.rating) {
        return alert('Please select a rating');
      }

      if (!window.confirm('Submit review?')) return;

      await API.post('/reviews', {
        rating: Number(data.rating),
        comment: data.comment,
        requestId,
      });

      alert('Review submitted');

      fetchTutors();
      fetchMyRequests();

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // ========================
  // MATERIAL ACCESS
  // ========================
  const handleAccess = async (id) => {
    try {
      const { data } = await API.get(`/materials/${id}`);
      if (data.downloadUrl) window.open(data.downloadUrl, '_blank');
    } catch (error) {
      alert(error.response?.data?.message || 'Access denied');
    }
  };

  const handlePayment = async (materialId) => {
    const { data } = await API.post('/payments/initialize', {
      materialId,
    });

    window.location.href = data.paymentLink;
  };

  // ========================
  // STAR DISPLAY
  // ========================
  const renderStars = (rating) => {
    return '⭐'.repeat(Math.round(rating || 0));
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* ================= MATERIALS ================= */}
      <h2>Study Materials</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {materials.map((m) => (
          <Card key={m._id}>
            <h4>{m.title}</h4>
            <p>{m.description}</p>

            {m.isFree ? (
              <Button onClick={() => handleAccess(m._id)}>Open</Button>
            ) : (
              <>
                <p><strong>₦{m.price}</strong></p>
                <Button onClick={() => handlePayment(m._id)}>Unlock</Button>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* ================= REQUEST TUTOR ================= */}
      <div style={{ marginTop: '40px' }}>
        <h3>Request a Tutor</h3>

        <form onSubmit={handleRequest}>
          <select
            onChange={(e) =>
              setRequest({ ...request, tutorId: e.target.value })
            }
          >
            <option value="">Select Tutor</option>

            {tutors.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} - ⭐ {t.avgRating?.toFixed(1) || 0} ({t.total || 0})
              </option>
            ))}
          </select>

          <br /><br />

          <input placeholder="Subject" onChange={(e) => setRequest({ ...request, subject: e.target.value })} />
          <br /><br />

          <input type="date" onChange={(e) => setRequest({ ...request, sessionDate: e.target.value })} />
          <br /><br />

          <input type="time" onChange={(e) => setRequest({ ...request, timeSlot: e.target.value })} />
          <br /><br />

          <textarea placeholder="Message" onChange={(e) => setRequest({ ...request, message: e.target.value })} />
          <br /><br />

          <button type="submit">Send Request</button>
        </form>
      </div>

      {/* ================= MY REQUESTS ================= */}
      <div style={{ marginTop: '40px' }}>
        <h3>My Tutor Requests</h3>

        {myRequests.length === 0 && <p>No requests yet</p>}

        {myRequests.map((r) => (
          <Card key={r._id}>
            <p><strong>Subject:</strong> {r.subject}</p>
            <p><strong>Tutor:</strong> {r.tutor?.name}</p>
            <p><strong>Date:</strong> {new Date(r.sessionDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {r.timeSlot}</p>
            <p><strong>Status:</strong> {r.status}</p>

            {r.status === 'accepted' && r.meetingLink && (
              <button onClick={() => window.open(r.meetingLink, '_blank')}>
                Join Session
              </button>
            )}

            {r.status === 'accepted' && (
              <div style={{ marginTop: '10px' }}>
                <p>{renderStars(reviews[r._id]?.rating)}</p>

                <select onChange={(e) => handleReviewChange(r._id, 'rating', e.target.value)}>
                  <option value="">Rate</option>
                  <option value="5">⭐⭐⭐⭐⭐</option>
                  <option value="4">⭐⭐⭐⭐</option>
                  <option value="3">⭐⭐⭐</option>
                  <option value="2">⭐⭐</option>
                  <option value="1">⭐</option>
                </select>

                <input
                  placeholder="Comment"
                  onChange={(e) => handleReviewChange(r._id, 'comment', e.target.value)}
                />

                <button onClick={() => submitReview(r._id)}>
                  Submit Review
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* ================= CTA ================= */}
      <div style={{ marginTop: '40px' }}>
        <Link to="/become-tutor">
          <Card>Become a Tutor</Card>
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;