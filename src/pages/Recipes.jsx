import React from 'react';
import Header from '../components/Header';
import ContextProvider from '../context/ContextProvider';

export default function Recipes() {
  return (
    <div>
      <ContextProvider>
        <Header />
      </ContextProvider>
    </div>
  );
}
