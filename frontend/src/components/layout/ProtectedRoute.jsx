import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingScreen from '../common/LoadingScreen';

export default function ProtectedRoute({ children }) {
  const { token, user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <LoadingScreen message="Verifying session..." />;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
