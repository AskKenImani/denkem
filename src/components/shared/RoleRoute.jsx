import { Navigate } from 'react-router-dom';

const RoleRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || user.role !== role) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default RoleRoute;