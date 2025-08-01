// src/pages/StudentApp.jsx
import React from 'react';
import MyNavbar from '../components/MyNavBar';
import './Style/StenteApp.css';
import Hero from '../components/Hero';
import StudentCourses from '../components/StudentCourses';
import { Outlet } from 'react-router-dom';


export default function StudentApp() {
  return (
    <>
      <div id='nav-bar'>
        <MyNavbar />
      </div>
      <main>
        <Hero />
        <Outlet />
      </main>
    </>
  );
}