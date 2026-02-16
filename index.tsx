
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Login from './Login';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

function Root() {
  const [authed, setAuthed] = useState(localStorage.getItem('krv_auth') === 'true');

  function handleLogout() {
    localStorage.removeItem('krv_auth');
    setAuthed(false);
  }

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', background: '#f1f5f9'}}>
      <App />
    </div>
  );
}

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
