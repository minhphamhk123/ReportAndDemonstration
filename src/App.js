import './App.css';
import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

class App extends React.Component {
  handleEditorChange = (e) => {
    console.log('Content was updated:', e.target.getContent());
  }

  render() {
    return (
      <Editor
        initialValue="<p>This is the initial content of the editor</p>"
        init={{
          plugins: 'link image code ai tinycomments',
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | tinycomments |',
          ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant"))
        }}
        onChange={this.handleEditorChange}
      />
    );
  }
}

export default App;
