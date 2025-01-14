import React from 'react';
import ReactDOM from 'react-dom/client';
import './Grid.css';
import Window from '../Window/Window.js';

const Grid = () => {
  function handleClick(){
    const container = document.getElementById('window-container');
    const root = ReactDOM.createRoot(container);
    root.render(<Window/>);
  }
  return (
    <div>
      <div id="window-container"></div>
      <div class="board">
          <div class="row">
            <div class="filler"></div>
            <div class="prompt column-prompt">Placeholder 1</div>
            <div class="prompt column-prompt">Placeholder 2</div>
            <div class="prompt column-prompt">Placeholder 3</div>
          </div>
          <div class="row">
            <div class="prompt row-prompt">Placeholder 4</div>
            <div class="box" onClick={handleClick}></div>
            <div class="box" onClick={handleClick}></div>
            <div class="box" onClick={handleClick}></div>
          </div>
          <div class="row">
            <div class="prompt row-prompt">Placeholder 5</div>
            <div class="box" onClick={handleClick}></div>
            <div class="box" onClick={handleClick}></div>
            <div class="box" onClick={handleClick}></div>
          </div>
          <div class="row">
            <div class="prompt row-prompt">Placeholder 6</div>
            <div class="box" onClick={handleClick}></div>
            <div class="box" onClick={handleClick}></div>
            <div class="box" onClick={handleClick}></div>
          </div>
      </div>
      <div class="guesses-and-score">
          <h2>Guesses left: 10 &nbsp; &nbsp; Score: 900</h2>
      </div>
    </div>
  );
};

export default Grid;
