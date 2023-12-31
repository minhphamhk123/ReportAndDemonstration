// import './index.css ';
import React from 'react';
// import { Editor } from '@tinymce/tinymce-react';
// import { GoogleLogin } from '@react-oauth/google';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';

// class App extends React.Component {

//   handleEditorChange = (e) => {
//     console.log('Content was updated:', e.target.getContent());
//   }
//   render() {
//     return (
//       <Editor
//         initialValue="<p>This is the initial content of the editor</p>"
//         init={{
//           plugins: 'link image code ai tinycomments',
//           toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | tinycomments |',
//           ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant"))
//         }}
//         onChange={this.handleEditorChange}
//       />
//     );
//   }
// }

function App() {
  return (
    <BrowserRouter>
      {/* header */}
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
