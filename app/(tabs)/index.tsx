import React from 'react';
import { ThemeProvider } from '../ThemeContext';
import CivicConnectApp from '../CivicConnectApp';
import layout from '../_layout';

export default function App() {
  return (
    <ThemeProvider>
      <CivicConnectApp />
    </ThemeProvider>
  );
}