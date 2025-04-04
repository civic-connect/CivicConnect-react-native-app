import React from 'react';
import { ThemeProvider } from '../ThemeContext';
import CivicConnectApp from '../CivicConnectApp';
export default function App() {
  return (
    <ThemeProvider>
      <CivicConnectApp />
    </ThemeProvider>
  );
}