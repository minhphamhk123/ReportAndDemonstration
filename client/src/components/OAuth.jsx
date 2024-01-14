import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
const SCOPES = 'https://www.googleapis.com/auth/drive+https://www.googleapis.com/auth/documents';
export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //const [token, setToken] = useState(null);
  //const [userInfo, setUserInfo] = useState({});

  const handleGoogleClick = async (token) => {
    try {
      // const provider = new GoogleAuthProvider();
      // const auth = getAuth(app)
      //const result = await signInWithPopup(auth, provider);
      const userInfo = await fetchUserInfo(token);
      sessionStorage.setItem("TOKEN_GG", token)
      console.log("user: ", userInfo)
      const res = await fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          photo: userInfo.picture,
        }),
      });
      const data = await res.json();
      console.log(data);
      dispatch(signInSuccess(data.user));
      navigate('/');
    } catch (error) {
      console.log('could not login with google', error);
    }
  };

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.file",
    onSuccess: tokenResponse => {
      //setToken(tokenResponse.access_token);
      handleGoogleClick(tokenResponse.access_token)
    }
  });

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`, // Replace YOUR_ACCESS_TOKEN with the actual access token
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user information');
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Error fetching user information:', error);
    }
  };

  return (
    <button
      type='button'
      onClick={login}
      className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95'
    >
      Continue with google
    </button>
  );
}