import React, { useState } from 'react';
import './Window.css';

const Window = () => {
  const [isOpen, setIsOpen] = useState(true);

  const closeModal = () => setIsOpen(false);

  return (
    <div>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={closeModal} className="close-modal-button">
              &times;
            </button>
            <h2>Guess a Game</h2>
            <h3>Prompts needed here</h3>
            <p>Search bar here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Window;
