import { useCallback, useEffect, useState } from 'react';
import styles from '../styles/Navbar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { BsCameraFill } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from './Logo';
import Modal from './Modal';
import { createDocAction } from '../redux/documents/docs.actions';
import {
     updateUserStart,
     updateUserSuccess,
     updateUserFailure,
     deleteUserStart,
     deleteUserSuccess,
     deleteUserFailure,
     signOut,
} from '../redux/user/userSlice';
import Loading from './Loading';

// const updateProfile = async (imgLink) => {
//      if (!imgLink) return;

//      try {
//           const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/profile`, {
//                method: 'PATCH',
//                body: JSON.stringify({ avatarURL: imgLink }),
//                headers: {
//                     'Content-Type': 'application/json',
//                     'authorization': sessionStorage.getItem("TOKEN")
//                }
//           })

//           const data = await res.json();

//           // * IF TOKEN EXPIRED
//           if (res.status === 401) {

//                // remove user data from the session
//                sessionStorage.clear();

//                // Getting undefined in the alert for `window.location.replace` function that's why giving "" using or operator
//                alert(`Session Expired! \nPlease Login again.. ${window.location.replace('/auth') || ""}`);
//                return;
//           }

//           if (res.ok) {
//                // Update user data in session-storage
//                const userInfo = JSON.parse(sessionStorage.getItem("USER"));
//                const newUserInfo = { ...userInfo, avatarURL: imgLink };
//                sessionStorage.setItem("USER", JSON.stringify(newUserInfo));
//           }

//           alert(data.message)

//      } catch (error) {
//           console.log('error:', error)
//           alert(error.message)
//      }
// }


function Navbar() {
     const { currentUser } = useSelector((state) => state.user);
     const { loading: createDocLoading } = useSelector((state) => state.docs);
     const dispatch = useDispatch();
     const navigate = useNavigate();
     const [loading, setLoading] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
     const [showUserInfo, setShowUserInfo] = useState(false);
     // const [userInfo, setUserInfo] = useState(JSON.parse(sessionStorage.getItem("USER")) || "");
     const [avatarUrl, setAvatarUrl] = useState('');
     const [isOpenModal, setIsOpenModal] = useState(false);


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

     //Tao file cho he thong
     async function createFolderIfNotExists(folderName) {
          try {
               const accessToken = sessionStorage.getItem("TOKEN_GG");

               // Kiểm tra xem thư mục đã tồn tại chưa
               const checkIfExistsResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
                    method: 'GET',
                    headers: {
                         Authorization: `Bearer ${accessToken}`,
                    },
               });

               if (!checkIfExistsResponse.ok) {
                    throw new Error('Failed to check folder existence');
               }

               const existingFiles = await checkIfExistsResponse.json();
               const existingFolder = existingFiles.files.find(file => file.name === folderName && file.mimeType === 'application/vnd.google-apps.folder');

               if (existingFolder) {
                    // Thư mục đã tồn tại, không cần tạo mới
                    console.log(`Folder "${folderName}" already exists with ID:`, existingFolder.id);
                    return existingFolder.id;
               }

               // Nếu thư mục chưa tồn tại, tạo mới
               const createFolderResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
                    method: 'POST',
                    headers: {
                         Authorization: `Bearer ${accessToken}`,
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                         name: folderName,
                         mimeType: 'application/vnd.google-apps.folder',
                    }),
               });

               if (!createFolderResponse.ok) {
                    throw new Error('Failed to create folder');
               }

               const newFolder = await createFolderResponse.json();
               console.log(`Folder "${folderName}" created with ID:`, newFolder.id);
               return newFolder.id;
          } catch (error) {
               console.error('Error:', error);
          }
     }

     // Tạo thư mục mới trong Google Drive
     async function createFolder(parentFolderId, folderName) {
          try {
               var accessToken = sessionStorage.getItem("TOKEN_GG");

               // Kiểm tra xem thư mục đã tồn tại chưa
               const existingFolder = await fetch(`https://www.googleapis.com/drive/v3/files?q='${parentFolderId}'+in+parents+and+name='${folderName}'`, {
                    headers: {
                         Authorization: `Bearer ${accessToken}`,
                    },
               });

               const existingFolderData = await existingFolder.json();

               if (existingFolderData.files.length > 0) {
                    // Thư mục đã tồn tại, trả về ID của thư mục đó
                    return existingFolderData.files[0].id;
               }

               // Thư mục chưa tồn tại, tạo mới
               const createFolderResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
                    method: 'POST',
                    headers: {
                         Authorization: `Bearer ${accessToken}`,
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                         name: folderName,
                         mimeType: 'application/vnd.google-apps.folder',
                         parents: [parentFolderId],
                    }),
               });

               const createFolderData = await createFolderResponse.json();

               if (!createFolderResponse.ok) {
                    throw new Error('Failed to create folder');
               }

               // Trả về ID của thư mục mới tạo
               return createFolderData.id;
          } catch (error) {
               console.error('Error:', error);
               throw error;
          }
     }

     //Lay noi dung trong file mau
     // async function getDocumentContent() {
     //      var accessToken = sessionStorage.getItem("TOKEN_GG");
     //      const response = await fetch(`https://docs.googleapis.com/v1/documents/1G_vfXVOP4yhpdHjDBNx4zS5v3-no1pupmUjlFEblfkE`, {
     //           headers: {
     //                Authorization: `Bearer ${accessToken}`,
     //           },
     //      });

     //      if (!response.ok) {
     //           throw new Error('Failed to get document content');
     //      }

     //      const responseData = await response.json();
     //      return responseData.body.content;
     // }

     //create google docs
     async function createFile() {
          setIsLoading(true);
          var accessToken = sessionStorage.getItem("TOKEN_GG");
          console.log("accessToken: ", accessToken);

          // const preContent = await getDocumentContent();
          // console.log("preContent: ", preContent);

          const folderId = await createFolderIfNotExists('Báo cáo và minh chứng');
          console.log("folderId: ", folderId);

          const parentFolderId = folderId;
          const folderName = getCurrentDateFormatted();
          const folderContainId = await createFolder(parentFolderId, folderName);
          console.log("folderName: ", folderName);
          console.log("folderContainId: ", folderContainId);

          // const response = await fetch('https://docs.googleapis.com/v1/documents', {
          //      method: "POST",
          //      headers: {
          //           Authorization: `Bearer ${accessToken}`,
          //      },
          //      body: JSON.stringify({
          //           title: 'New Document',
          //      }),
          // }
          // );

          // if (!response.ok) {
          //      throw new Error('Failed to post doc');
          // }

          // const responseData = await response.json();
          // console.log("full return docs: ", responseData);
          // console.log("doc id: ", responseData.documentId);

          // const responseBatch = await fetch('http://localhost:8080/createDocumentWithContent', {
          //      method: 'POST',
          //      headers: {
          //           'Content-Type': 'application/json',
          //      },
          //      body: JSON.stringify({ accessToken, preContent, documentId: responseData.documentId }),
          // });

          // if (!responseBatch.ok) {
          //      throw new Error('Failed to batch document with content');
          // }

          // const responseDataBatch = await responseBatch.json();

          // console.log('Batch document with content:', responseDataBatch);

          // Thêm tài liệu vào thư mục đã tạo
          const copyResponse = await fetch(`https://www.googleapis.com/drive/v3/files/1G_vfXVOP4yhpdHjDBNx4zS5v3-no1pupmUjlFEblfkE/copy`, {
               method: 'POST',
               headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                    parents: [folderContainId],
               }),
          });

          if (!copyResponse.ok) {
               throw new Error('Failed to copy document to the new folder');
          }

          const copyData = await copyResponse.json();
          const newDocumentId = copyData.id;

          // Step 3: Delete the original document (optional)
          // const deleteResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${responseData.documentId}`, {
          //      method: 'DELETE',
          //      headers: {
          //           'Authorization': `Bearer ${accessToken}`,
          //      },
          // });

          // if (!deleteResponse.ok) {
          //      throw new Error('Failed to delete original document');
          // }

          console.log(`Document moved to new folder. New document ID: ${newDocumentId}`);
          setIsLoading(false);
          setIsOpenModal(false);
          sessionStorage.setItem("DOCS_EDIT", newDocumentId);
          navigate('/docs-edit');
     }

     // Hàm trả về ngày tháng năm hiện tại theo định dạng "YYYY-MM-DD"
     function getCurrentDateFormatted() {
          const currentDate = new Date();
          return `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
     }

     // Log-out
     const handleSignOut = async () => {
          try {
               await fetch('http://localhost:8080/api/auth/signout');
               dispatch(signOut())
          } catch (error) {
               console.log(error);
          }
     };


     // // IMAGE upload in cloudinary
     // const imageUpload = useCallback(async (e) => {
     //      const imgFile = e.target.files[0];
     //      if (!imgFile) return;
     //      if (imgFile.size > 2097152) return alert("Please upload image with less-then 2MB size")

     //      setLoading(true);

     //      try {
     //           // !IMAGE UPLOAD IN CLOUDINARY
     //           const data = new FormData();
     //           data.append("file", imgFile)

     //           data.append("upload_preset", import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET)

     //           data.append("cloud_name", import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME);

     //           const res = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, data)

     //           setAvatarUrl(res.data.secure_url)

     //           updateProfile(res.data.secure_url)

     //           setLoading(false)
     //      } catch (error) {
     //           console.log('error:', error)
     //           setLoading(false)
     //      }
     // }, [])


     // useEffect(() => {
     //      if (currentUser.username) setUserInfo(currentUser);
     // }, [currentUser])

     return (
          <div className={styles.navbar}>
               <Link to='/'>
                    <Logo />
               </Link>
               <ul>
                    <li>
                         <Link to='/'>
                              <p className={styles.Link}>Home</p>
                         </Link>
                         <Link to='/about'>
                              <p className={styles.Link}>About</p>
                         </Link>
                         <Link to='/test'>
                              <p className={styles.Link}>Drive</p>
                         </Link>
                    </li>
                    <li>
                         <button
                              onClick={openModal}
                              className={styles['create-doc']}
                         >Create Doc +</button>
                    </li>
                    <li>
                         {
                              currentUser ?
                                   <section className={styles['profile-main']}>
                                        <div className={styles.profile} onClick={() => { setShowUserInfo(!showUserInfo) }}>
                                             <img src={avatarUrl || currentUser?.profilePicture} />
                                        </div>

                                        {
                                             showUserInfo && <div className={styles['profile-info']}>
                                                  <figure>
                                                       <div className={styles['profile-img']}>
                                                            <img src={avatarUrl || currentUser?.profilePicture} />
                                                            {loading && <div className={styles['profile-loading']}>
                                                                 <p>Wait...</p>
                                                            </div>}
                                                            <div className={styles['profile-upload']}>
                                                                 {/* <input type="file" name="profile-upload" id="profile-upload" onChange={imageUpload} /> */}
                                                                 <label htmlFor="profile-upload">
                                                                      <BsCameraFill />
                                                                 </label>
                                                            </div>
                                                       </div>
                                                       <figcaption className={styles['user-name']}>{currentUser.username}</figcaption>
                                                  </figure>

                                                  <button onClick={() => navigate('/my-docs')}>My Documents</button>
                                                  <button onClick={() => navigate('/profile')}>My Profile</button>

                                                  <button onClick={handleSignOut}>Log out</button>
                                             </div>
                                        }
                                   </section> :
                                   <Link to='/sign-in'><button>Login</button></Link>
                         }
                    </li>
               </ul>


               {/* MODAL */}
               <Modal isOpen={isOpenModal} onClose={closeModal} title='Create Document'>
                    <form className={styles['create-doc-form']} onSubmit={handleCreateDoc} disabled={isLoading}>
                         <div className={styles['modal-input-box']}>
                              <input id="title" type="text" required />
                              <label htmlFor='title'>Title</label>
                         </div>
                         <div className={styles['modal-input-checkbox']}>
                              <input id="isPublic" type="checkbox" />
                              <label htmlFor='isPublic'>Make it 🌎 Public</label>
                         </div>

                         <button type="submit" disabled={createDocLoading}>Create Document</button>
                         <button className={styles.button_create_doc} type="submit" disabled={createDocLoading} onClick={createFile}>Create Google Docs</button>
                    </form>
                    {isLoading && <p>Loading...</p>}
               </Modal>
          </div>
     )
}

export default Navbar