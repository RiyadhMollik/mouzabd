import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { getBaseUrl } from '../utils/baseurls';
import { decodeToken } from '../utils/TokenDecoder';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userdata = user ? decodeToken(user) : null;

  // ✅ Restore from localStorage on page load + keep in sync
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    }

    setLoading(false);

    // sync checker (current interval kept as-is)
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ---------- REGISTER (email / google) ----------
  const register = async (method, payload) => {
    setLoading(true);
    try {
      let response;

      if (method === 'email') {
        // Example payload: { name, email, password, ... }
        response = await axios.post(`${getBaseUrl()}/users/`, payload);
      } else if (method === 'google') {
        // payload: { token }
        const { token } = payload || {};
        if (!token) throw new Error('Google token missing');
        response = await axios.post(`${getBaseUrl()}/google-signup/`, { token });
      } else {
        throw new Error('Unknown register method');
      }

      // Try to normalize response
      const d = response?.data || {};
      const access =
        d.access || d.token || d.access_token || d.data?.access || d.data?.token;
      const refresh =
        d.refresh || d.data?.refresh;
      const userObj =
        d.user ||
        d.data?.user ||
        d.data?.results?.user ||
        d.results?.user ||
        d.profile ||
        null;

      if (access) {
        // ✅ Save token + user like login
        localStorage.setItem('token', access);
        if (refresh) localStorage.setItem('refresh', refresh);
        if (userObj) localStorage.setItem('user', JSON.stringify(userObj));

        axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        if (userObj) setUser(userObj);

        return { success: true, user: userObj || null, token: access, refresh };
      }

      // No token returned (some APIs do this on signup). Try auto login if email method and creds exist
      if (
        method === 'email' &&
        payload?.email &&
        payload?.password
      ) {
        await logIn('email', {
          email: payload.email,
          password: payload.password,
        });
        return {
          success: true,
          user: JSON.parse(localStorage.getItem('user') || 'null'),
          token: localStorage.getItem('token') || null,
          refresh: localStorage.getItem('refresh') || null,
        };
      }

      // If still here, no token and not able to auto-login
      return { success: true, user: userObj || null };

    } catch (error) {
      console.error('Register failed:', error?.response?.data || error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Registration failed. Please try again.';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Backward compatibility: keep createUser API but route to register('email')
  const createUser = async (formData) => {
    return register('email', formData);
  };

  // ---------- LOGIN ----------
  const logIn = async (method, credentials) => {
    setLoading(true);
    try {
      let response;

      if (method === 'email') {
        const { email, password } = credentials;
        response = await axios.post(`${getBaseUrl()}/login/`, { email, password });
      } else if (method === 'google') {
        const { token } = credentials;
        response = await axios.post(`${getBaseUrl()}/google-login/`, { token });
      }

      const { access, user, refresh } = response.data;

      localStorage.setItem('token', access);
      localStorage.setItem('user', JSON.stringify(user));
      if (refresh) localStorage.setItem('refresh', refresh);

      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      setUser(user);

      return { success: true, user, token: access };
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Login failed. Please try again.';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ---------- LOGOUT ----------
  const logOut = async () => {
    setLoading(true);
    const access = localStorage.getItem('token');
    const refresh = localStorage.getItem('refresh');

    try {
      await axios.post(
        `${getBaseUrl()}/logout/`,
        { refresh },
        {
          headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Error logging out:', error.response?.data || error.message);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refresh');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }
  };

  const authInfo = {
    userdata,
    user,
    loading,
    // expose both for flexibility
    register,      // ✅ new unified register (email/google)
    createUser,    // ✅ backward compatible alias -> register('email', ...)
    logIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
