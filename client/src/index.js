import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals";
//import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store.js";
import Home from "./pages/Home.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from "./contexts/UserContext.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <GoogleOAuthProvider clientId="546285400637-58g3065b8fo0krcpul28m2e663bi02m1.apps.googleusercontent.com">
  //   <React.StrictMode>
  //     <App />
  //   </React.StrictMode>
  // </GoogleOAuthProvider>,
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}><Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <UserProvider>
        <App />
      </UserProvider>
    </PersistGate>
  </Provider></GoogleOAuthProvider>


  // <Home />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
