import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  return !token ? children : <Navigate to="/dashboard" />;
};

export default PublicRoute;
