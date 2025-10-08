import { useContext } from 'react';


import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../provider/AuthProvider';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location=useLocation()

    // If still loading authentication status, show a loading spinner
    if (loading) {
        return <span className="loading loading-spinner loading-lg"></span>;
    }

    // If the user is authenticated, render the children (protected content)
    if (user) {
        return children;
    }

    // If not authenticated, store the current path and redirect to login
     // Store the current location in localStorage
    return <Navigate state={{from:location}} replace to="/login"></Navigate>;
};

export default PrivateRoute;
