import React from 'react';
import Btn from '../Buttons/Btn';
import './Menu.css';

export default function Menu() {
  return (
    <div className="menu">
      <div className="left">
        <Btn navigateToLink="/garage" title="Garage" />
        <Btn navigateToLink="/winners" title="Winners" />
      </div>
      <div className="right">
        <h1>Welcome to the Garage</h1>
        <p>This is where you can park your cars!</p>
      </div>
    </div>
  );
}
