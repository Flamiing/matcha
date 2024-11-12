//import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
	/*const { isAuthenticated } = useAuth();
	const location = useLocation();

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	} */

	// TODO -> Change this for auth protection

	return children;
};

export default ProtectedRoute;
