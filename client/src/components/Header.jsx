import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import Logo from './Logo';
import Modal from './Modal';

import { createDocAction } from '../redux/documents/docs.actions';


export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const { loading: createDocLoading } = useSelector((state) => state.docs);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navbar = {
    backgroundColor: 'blue',
  };
  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '72rem', // Bạn cần xác định giá trị cụ thể của 6xl hoặc sử dụng giá trị tương đương trong pixel
    margin: 'auto',
    padding: '3',
  };
  const ul = {
    display: 'flex',
    gap: '1rem', // Điều này tương đương với lớp gap-4 trong Tailwind CSS
    // Các thuộc tính CSS khác nếu cần
  };
  const imageStyle = {
    height: '1.75rem', // Thay '7rem' bằng giá trị cụ thể tương ứng với lớp h-7 trong Tailwind CSS
    width: '1.75rem', // Thay '7rem' bằng giá trị cụ thể tương ứng với lớp w-7 trong Tailwind CSS
    borderRadius: '50%', // Để làm cho hình tròn, sử dụng giá trị '50%' cho thuộc tính borderRadius
    objectFit: 'cover', // Tương đương với lớp object-cover trong Tailwind CSS
    // Các thuộc tính CSS khác nếu cần
    maxWidth: 'none',
  };
  const li = {
    maxWidth: '100%', // Thiết lập giá trị max-width thành 100% tương đương với lớp w-max trong Tailwind CSS
    // Các thuộc tính CSS khác nếu cần
  };
  // to open the modal
  const openModal = useCallback(() => {
    setIsOpenModal(true);
  }, []);

  // to close the modal
  const closeModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const handleCreateDoc = useCallback((e) => {
    e.preventDefault();
    const doc = {
      title: e.target.title.value,
    }
    const isPbulicVal = e.target.isPublic.checked;
    if (isPbulicVal) doc.isPublic = isPbulicVal;

    const callback = (docId) => {
      closeModal();
      if (docId) navigate(`/docs/${docId}`);
    }

    dispatch(createDocAction({ doc, cb: callback }))
  }, []);

  return (
    <div className={styles.navbar}>
      <div style={containerStyle} className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <Logo />
        </Link>
        <ul style={ul} className='flex gap-4'>
          <Link to='/'>
            <li>Home</li>
          </Link>
          <Link to="/about">
            <li>About</li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img style={imageStyle} src={currentUser.profilePicture} alt='profile' className='h-7 w-7 rounded-full object-cover' />
            ) : (
              <li style={li} className='w-max'>Sign In</li>
            )}
          </Link>
          <li>
            <button
              onClick={openModal}
              className={styles['create-doc']}
            >Create Doc +</button>
          </li>
        </ul>
      </div>
      {/* MODAL */}
      <Modal isOpen={isOpenModal} onClose={closeModal} title='Create Document'>
        <form className={styles['create-doc-form']} onSubmit={handleCreateDoc}>
          <div className={styles['modal-input-box']}>
            <input id="title" type="text" required />
            <label htmlFor='title'>Title</label>
          </div>
          <div className={styles['modal-input-checkbox']}>
            <input id="isPublic" type="checkbox" />
            <label htmlFor='isPublic'>Make it 🌎 Public</label>
          </div>

          <button type="submit" disabled={createDocLoading}>Create Document</button>
        </form>
      </Modal>
    </div>
  );
}
