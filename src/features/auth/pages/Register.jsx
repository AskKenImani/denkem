import { useState } from 'react';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import API from '../../../api/axios';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post('/auth/register', form);

    navigate('/');
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <br /><br />

        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <br /><br />

        <Button type="submit">Register</Button>
      </form>
    </div>
  );
};

export default Register;