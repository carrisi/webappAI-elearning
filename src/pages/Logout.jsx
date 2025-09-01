import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await signOut(auth);
      } catch (err) {
        console.error('logout error:', err);
      } finally {
        navigate('/login', { replace: true });
      }
    })();
  }, [navigate]);

  return <div className="py-5 text-white">Uscita in corso…</div>;
}
