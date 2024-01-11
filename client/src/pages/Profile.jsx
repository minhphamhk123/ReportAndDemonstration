import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../redux/user/userSlice';
import styles from '../styles/Profile.module.css'

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);
  
  useEffect(() => {
    if (image) {
      //console.log("image: ", image)
      handleFileUpload(image);
    }
  }, [image]);
  
  const handleFileUpload = async (image) => {
    //console.log("Config: ", app)
    const storage = getStorage(app);
    //console.log("storage: ", storage)
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    console.log("function: ", uploadTask)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
        console.log("Upload: ", progress);
      },
      (error) => {
        setImageError(true);
        console.log("error: ", error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
        console.log("URL: ", formData)
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`http://localhost:8080/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userid': sessionStorage.getItem("TOKEN")
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`http://localhost:8080/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('http://localhost:8080/api/auth/signout');
      dispatch(signOut())
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={styles.main_page}>
      <h1 className={styles.header}>Profile</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />
        {/* 
      firebase storage rules:  
      allow read;
      allow write: if
      request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('image/.*') */}
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt='profile'
          className={styles.img}
          onClick={() => fileRef.current.click()}
        />
        <p className={styles.p}>
          {imageError ? (
            <span className={styles.red_span}>
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className={styles.green_span}>{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className={styles.green_span}>Image uploaded successfully</span>
          ) : (
            ''
          )}
        </p>
        <input
          defaultValue={currentUser.username}
          type='text'
          id='username'
          placeholder='Username'
          className={styles.input}
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser.email}
          type='email'
          id='email'
          placeholder='Email'
          className={styles.input}
          onChange={handleChange}
        />
        <input
          type='password'
          id='password'
          placeholder='Password'
          className={styles.input}
          onChange={handleChange}
        />
        <button className={styles.button}>
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className={styles.container}>
        <span
          onClick={handleDeleteAccount}
          className={styles.red_span_click}
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className={styles.red_span_click}>
          Sign out
        </span>
      </div>
      <p className={styles.p_show}>{error && 'Something went wrong!'}</p>
      <p className={styles.p_show_success}>
        {updateSuccess && 'User is updated successfully!'}
      </p>
    </div>
  );
}