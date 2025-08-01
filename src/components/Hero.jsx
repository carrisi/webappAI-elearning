// src/components/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import laureaImg1 from '../assets/images/laurea1.png';
import laureaImg2 from '../assets/images/laurea2.png';
import styles from './component-style/Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Student<br/>Dashboard</h1>
        <motion.img 
          src={laureaImg1} 
          alt="cursor"
          className={styles.laureaIcon1}
          drag
          dragSnapToOrigin
        />
        <motion.img 
          src={laureaImg2} 
          alt="cursor"
          className={styles.laureaIcon2}
          drag
          dragSnapToOrigin
        />
        <p className={styles.text}>Scopri e gestisci tutti i tuoi corsi attivi,<br />controlla i progressi e riprendi subito lo studio dove l’hai lasciato.</p>
        
        <button className={styles.button}>I miei corsi</button>
      </div>
    </section>
  );
}