// src/components/VideoPlayer.jsx
import React from 'react';
import './component-style/VideoPlayer.css';

const VideoPlayer = ({ src }) => (
  <video className="video-player" controls preload="metadata">
    <source src={src} type="video/mp4" />
    Il tuo browser non supporta il tag video.
  </video>
);

export default VideoPlayer;
