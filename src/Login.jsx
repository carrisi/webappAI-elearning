import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

import './Login.css';
import RoleSwitch from './components/RoleSwitch.jsx';
import LogoImg from './assets/logo_placeholder.png';


const roles = [
  { key: 'studente', label: 'Studente'},
  { key: 'docente',  label: 'Docente'},
];

const Login = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const navigate                  = useNavigate();

  const handleRoleToggle = e => {
    // se checked = true → docente (index 1), altrimenti studente (index 0)
    setRoleIndex(e.target.checked ? 1 : 0);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await setDoc(
        doc(db, 'users', cred.user.uid),
        { role: roles[roleIndex].key },
        { merge: true }
      );
      navigate(roles[roleIndex].key === 'studente' ? '/studente' : '/docente');
    } catch (err) {
      console.error(err);
      setError('Email o password non validi');
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="left">
          <img src={LogoImg} alt="Logo piattaforma" id='logo_login'/>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum quas impedit labore est, consequatur sunt quos vero vitae eveniet voluptatem!</p>
        </div>

        <div className="right">
          <h2>Effettua il Login</h2>
          <form onSubmit={handleSubmit}>
            <RoleSwitch
              roleIndex={roleIndex}
              onToggle={handleRoleToggle}
            />

            <div className="form-group">
              <i className="fas fa-user" />
              <input
                type="text"
                placeholder="Username"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <i className="fas fa-lock" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

            <div className="checkbox-group">
              <label>
                <input type="checkbox" /> Remember
              </label>
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit" className="btn">LOGIN</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;