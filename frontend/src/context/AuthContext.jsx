import {
createContext,
useEffect,
useState,
} from "react";

import {
authApi,
getStoredAuthSession,
clearAuthSession,
} from "../api/auth";

export const AuthContext =
createContext(null);

export const AuthProvider = ({
children,
}) => {
const [user, setUser] =
useState(null);

const [token, setToken] =
useState(null);

const [loading, setLoading] =
useState(true);

useEffect(() => {
const initializeAuth =
async () => {
try {
const session =
getStoredAuthSession();


      const storedToken =
        session?.accessToken ||
        session?.token;

      if (!storedToken) {
        setLoading(false);
        return;
      }

      setToken(storedToken);

      const response =
        await authApi.getCurrentUser(
          storedToken
        );

      const userData =
        response?.data ||
        response?.user ||
        response;

      setUser(userData);
    } catch (error) {
      console.error(
        "Auth initialization failed:",
        error
      );

      clearAuthSession();

      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

initializeAuth();


}, []);

const logout = () => {
clearAuthSession();


setUser(null);
setToken(null);


};

return (
<AuthContext.Provider
value={{
user,
token,
loading,
setUser,
setToken,
logout,
}}
>
{children}
</AuthContext.Provider>
);
};
