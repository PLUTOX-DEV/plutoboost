
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { UserProvider } from './context/UserContext';
import App from './App';
import './index.css';

const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobileOrTouch = window.matchMedia('(pointer: coarse), (max-width: 1024px)').matches;
if (isReducedMotion || isMobileOrTouch) {
  document.body.classList.add('reduced-motion');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <MotionConfig reducedMotion={isReducedMotion || isMobileOrTouch ? 'always' : 'never'}>
      <UserProvider><App/></UserProvider>
    </MotionConfig>
  </BrowserRouter>
);