import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { login, logout } from "../reducers/auth/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, userId } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        dispatch(login({ userId: decodedToken.userId, token }));
      } catch (err) {
        console.error("Invalid Token:", err);
      }
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  return { isAuthenticated, userId };
};

export default useAuth;
