import Quill from 'quill';
import '../styles/SingleDoc.css';
import 'quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
import { MdPublic } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';
import { BsCheckLg } from 'react-icons/bs';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { RiSaveFill } from "react-icons/ri";
import { useParams, useNavigate } from 'react-router-dom';
import { RiGitRepositoryPrivateFill } from 'react-icons/ri';
import { FaGoogleDrive } from "react-icons/fa";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { useEffect, useCallback, useState, useRef } from 'react';
import { deleteDocAction, updateDocAction } from '../redux/documents/docs.actions';
import useSocketConnection from '../customHooks/useSocketConnection';

const TOOLBAR_OPTIONS = [
     [{ header: [1, 2, 3, 4, 5, 6, false] }],
     [{ font: [] }],
     [{ list: "order" }, { list: "bullet" }],
     ['bold', 'italic', 'underline', 'strike'],
     [{ color: [] }, { background: [] }],
     [{ script: 'sub' }, { script: 'super' }],
     [{ align: [] }],
     ["image", 'blockquote', 'code-block'],
     ['clean'],
]

// Debounce function to delay function execution
const debouncer = (cb, delay) => {
     let timerId;
     return (...args) => {
          if (timerId) clearTimeout(timerId);
          timerId = setTimeout(() => {
               cb(...args);
               timerId = null;
          }, delay);
          return timerId;
     }
}


function SingleDoc() {

     const dispatch = useDispatch();
     const navigate = useNavigate();
     const titleRef = useRef(null);
     const [quill, setQuill] = useState();
     const { id: documentId } = useParams();
     const [doc, setDoc] = useState({});
     const [isEditTitle, setIsEditTitle] = useState(false);
     const [userInfo, setUserInfo] = useState(sessionStorage.getItem("USER"));
     const [showOptions, setShowOptions] = useState(false);

     const handleButtonClick = () => {
          setShowOptions(!showOptions); // Đảo ngược trạng thái hiển thị/ẩn
     };

     const saveToDrive = () => {
          // Xử lý khi chọn "Lưu vào Google Drive"
          console.log('Save to Drive');
     };

     const saveToLocal = () => {
          // Xử lý khi chọn "Lưu vào máy tính"

          console.log('Save to Local');
     };

     // Connect to the socket server
     const socket = useSocketConnection("http://localhost:8080");

     // Change view to PUBLIC / PRIVATE
     const handleViewChange = useCallback(() => {
          const updateDocState = (val) => {
               const newDoc = { ...doc, isPublic: val }
               setDoc(newDoc);
          }

          const update = { isPublic: !doc.isPublic }
          dispatch(updateDocAction({ docId: documentId, update, updateDocState }))
     }, [dispatch, doc, documentId])

     // Change Title
     const handleTitleChange = useCallback(() => {
          const newTitle = titleRef.current.value;
          if (!newTitle || (newTitle === doc.title)) {
               setIsEditTitle(false);
               return
          }

          const updateDocState = (val) => {
               const newDoc = { ...doc, title: val }
               setDoc(newDoc);
               setIsEditTitle(false);
          }

          const update = { title: newTitle }
          if (userInfo === doc.author) dispatch(updateDocAction({ docId: documentId, update, updateDocState }))
     }, [dispatch, doc, documentId, userInfo])


     // Delete document
     const handleDeleteDoc = () => {
          const cb = () => {
               navigate('/');
          }
          if (userInfo === doc.author) dispatch(deleteDocAction({ docId: documentId, cb }))
     }


     // Save the data in the database with debounce
     const SaveDocWithDebounce = debouncer(() => {
          socket.emit("save-document", quill.getContents())
     }, 800)

     /*
     Creating it to store the ref because while using
     `useEffect` sometimes it invoked or called before the
     ref => references are apllied
     */
     const wrapperRef = useCallback(wrapper => {
          if (wrapper === null) return;

          wrapper.innerHTML = null;

          const editor = document.createElement('div');
          wrapper.append(editor);

          const quillInstance = new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS } });
          setQuill(quillInstance);
     }, [])


     // Scroll to the top of the page
     useEffect(() => {
          (function () {
               window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
               });
          })()
     }, [])

     // Load the content of the document
     useEffect(() => {
          if (socket == null || quill == null) return

          socket.once("load-document", data => {
               if (data.message === 'success') {
                    setDoc(data.doc);
                    quill.setContents(data.doc.doc)

                    const userInfoFSS = sessionStorage.getItem("USER");
                    setUserInfo(userInfoFSS);
                    // Enable editing if it's your document, otherwise disable
                    if (data.doc.author === userInfo) quill.enable()
                    else quill.disable();
               } else {
                    alert(data.message)
                    navigate('/');
               }
          })

          socket.emit("get-document", documentId)
     }, [socket, quill, documentId])


     // Receive changes in real-time
     useEffect(() => {
          if (socket == null || quill == null) return

          const handler = delta => {
               quill.updateContents(delta)
          }
          socket.on("receive-changes", handler)

          return () => {
               socket.off("receive-changes", handler)
          }
     }, [socket, quill])


     // Push changes to show it in real-time
     useEffect(() => {
          if (socket == null || quill == null) return
          let timeoutRef;

          const handler = (delta, oldDelta, source) => {
               if (source !== "user") return
               socket.emit("send-changes", delta)

               timeoutRef = SaveDocWithDebounce();
          }
          quill.on("text-change", handler)

          return () => {
               quill.off("text-change", handler);
               if (timeoutRef) clearTimeout(timeoutRef)
          }
     }, [socket, quill])


     return (
          <main>
               <div className='doc-info'>
                    {
                         isEditTitle ?
                              <div className='flex-box'>
                                   <input
                                        ref={titleRef}
                                        defaultValue={doc?.title}
                                        className='title-edit-input' />
                                   <div className='flex-box'>
                                        <BsCheckLg onClick={handleTitleChange} />
                                        <RxCross2 onClick={() => {
                                             setIsEditTitle(false)
                                        }} />
                                   </div>
                              </div> :
                              <h2
                                   onDoubleClick={() => {
                                        if (userInfo === doc.author) setIsEditTitle(true)
                                   }}
                              >{doc?.title}</h2>
                    }
                    <div>
                         <div className='container-button-drop'>
                              <button onClick={handleButtonClick}><RiSaveFill /> Save</button>
                              {showOptions && (
                                   <div className="save-options">
                                        <button onClick={saveToDrive}><FaGoogleDrive/>Save to Google Drive</button>
                                        <button onClick={saveToLocal}><HiOutlineComputerDesktop />Save to local</button>
                                   </div>
                              )}
                         </div>
                         <button
                              disabled={userInfo !== doc.author}
                              onClick={handleViewChange}
                         >
                              {doc?.isPublic ? <RiGitRepositoryPrivateFill /> :
                                   <MdPublic />}Set as {doc?.isPublic ? 'Private' : 'Public'}
                         </button>
                         <button
                              onClick={handleDeleteDoc}
                              disabled={userInfo !== doc.author}
                         >
                              <RiDeleteBin6Line />
                         </button>
                    </div>
               </div>
               <div className='container' ref={wrapperRef}></div>
          </main >
     )
}

export default SingleDoc