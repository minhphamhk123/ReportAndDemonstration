import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';
import styles from '../styles/SignIn.module.css'

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('http://localhost:8080/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data.user));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className={styles.main_page}>
      <h1 className={styles.header}>Sign In</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type='email'
          placeholder='Email'
          id='email'
          className={styles.input}
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          id='password'
          className={styles.input}
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className={styles.button}
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth />
      </form>
      <div className={styles.container}>
        <p>Dont Have an account?</p>
        <Link to='/sign-up'>
          <span className={styles.blue_span}>Sign up</span>
        </Link>
      </div>
      <p className={styles.p_show_error}>
        {error ? error.message || 'Something went wrong!' : ''}
      </p>
    </div>
  );
}