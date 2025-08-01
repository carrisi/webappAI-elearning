// src/pages/StudentApp.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import MyNavbar from '../components/MyNavBar';
import './Style/StenteApp.css';

export default function StudentApp() {
  return (
    <>
      <MyNavbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
