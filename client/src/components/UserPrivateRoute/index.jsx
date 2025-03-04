import { Outlet, Navigate } from "react-router-dom";
import { checkUserToken } from "../../utils";

const UserPrivateRoute = () => {
    console.log("🔹 UserPrivateRoute is executing..."); // ✅ Check if it's running
    const checktoken = checkUserToken();
    console.log("🔹 User Authenticated:", checktoken); // ✅ Check token detection

    return checktoken ? <Outlet /> : <Navigate to="/user/login" />;
};

export default UserPrivateRoute;
