import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"
import PropTypes from "prop-types"

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
const {user, isAuthenticated, isLoading} = useAuth();
const location = useLocation();
if(isLoading) {
    return <div>Loading...</div>;
}
if(!isAuthenticated){
    return <Navigate to ="/login" state={{from: location}} replace />;

}
if(allowedRoles.length > 0 && !allowedRoles.includes(user?.role)){
    return <Navigate to ="/unauthorized" replace />;
}
return children;
};
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
}
export default ProtectedRoute;