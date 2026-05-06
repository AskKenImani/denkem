import { useState } from 'react';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import API from '../../../api/axios';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';


const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await API.post('/auth/login', form);

    localStorage.setItem('user', JSON.stringify(data));

    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <Card>
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <br /><br />

          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <br /><br />

          <Button type="submit">Login</Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;