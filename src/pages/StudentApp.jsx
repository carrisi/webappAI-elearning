// src/pages/StudentApp.jsx
import React from 'react';
import MyNavbar from '../components/MyNavBar';
import './Style/StenteApp.css';
import Hero from '../components/Hero';


export default function StudentApp() {
  return (
    <>
      <div id='nav-bar'>
        <MyNavbar />
      </div>
      <main>
        <Hero />
      </main>
    </>
  );
}