// src/components/PDFViewer.jsx
import React from 'react';

const iframeStyle = {
  width: '100%',
  height: '100%',
  border: 'none',
  borderRadius: '8px',
};

export default function PDFViewer({ src }) {
  return (
    <iframe
      src={src}
      title="PDF Viewer"
      style={iframeStyle}
    />
  );
}
