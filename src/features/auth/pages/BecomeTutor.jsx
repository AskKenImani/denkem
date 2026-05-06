import { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import API from '../../../api/axios'; // ✅ FIXED

const BecomeTutor = () => {
  const [form, setForm] = useState({
    bio: '',
    subjects: '',
    experience: '',
  });

  const [cv, setCv] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const { data } = await API.get('/tutors/me');
      setApplication(data);
    } catch (error) {
      console.log('Fetch error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('bio', form.bio);
      formData.append('subjects', form.subjects);
      formData.append('experience', form.experience);

      if (cv) formData.append('cv', cv);

      for (let file of certificates) {
        formData.append('certificates', file);
      }

      await API.post('/tutors/apply', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Application submitted successfully');

      fetchApplication(); 
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || 'Error submitting application');
    }
  };

  if (application) {
    return (
      <div>
        <h2>Tutor Application</h2>
        <p>Status: {application.status}</p>

        {application.status === 'pending' && <p>Waiting for approval...</p>}
        {application.status === 'approved' && <p>You are now a tutor 🎉</p>}
        {application.status === 'rejected' && <p>Application rejected</p>}
      </div>
    );
  }

  return (
    <Card>
      <h2>Apply as Tutor</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          required
          placeholder="Your bio"
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
        <br /><br />

        <input
          required
          placeholder="Subjects (comma separated)"
          onChange={(e) =>
            setForm({ ...form, subjects: e.target.value })
          }
        />
        <br /><br />

        <input
          required
          placeholder="Experience"
          onChange={(e) =>
            setForm({ ...form, experience: e.target.value })
          }
        />
        <br /><br />

        <label>Upload CV</label><br />
        <input type="file" onChange={(e) => setCv(e.target.files[0])} />
        <br /><br />

        <label>Certificates</label><br />
        <input
          type="file"
          multiple
          onChange={(e) =>
            setCertificates(Array.from(e.target.files))
          }
        />
        <br /><br />

        <button type="submit">Submit Application</button>
      </form>
    </Card>
  );
};

export default BecomeTutor;