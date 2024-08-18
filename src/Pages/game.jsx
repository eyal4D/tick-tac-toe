import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import '@fontsource/roboto/500.css';
import { Typography } from '@mui/material'
import { redirect, useLocation, useNavigate } from 'react-router-dom';


function Square({ value, onSquareClick }) {
  return <Button variant="outlined" className='square' onClick={onSquareClick}>{value}</Button>
}

function Board({ currentTurn, squares, onPlay, playerSymbol }){
  let isMyTurn = (currentTurn[1] == playerSymbol[1]);

  function handleClick(i) {
    if (determineWinner(squares) || squares[i] || !isMyTurn) {
      return;
    }
    const nextSquares = squares.slice();;
    nextSquares[i] = playerSymbol[1];
    onPlay(nextSquares);
  };

  return (
    <div className='board'>
      <Typography className="player-label">Player {playerSymbol[0]} ({playerSymbol[1]})</Typography>
      <div className='board-row'>
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
      </div>
      <div className='board-row'>
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
      </div>
      <div className='board-row'>
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>
    </div>  
  );
}

export default function Game() {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new  URLSearchParams(location.search);
  const name1 = query.get('name1');
  const name2 = query.get('name2');
  
  useEffect(() => {
    if(!name1 || !name2) {
      navigate('/');
    }
  }, [location.search, navigate]);

  const players = [[name1, 'X'], [name2, 'O']]
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentTurn = players[currentMove % 2];
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  const moves = history.map((square, move) => {
    let description;
    if (move > 0){
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <Button variant="text" onClick={() => jumpTo(move)}>{description}</Button>
      </li>
    )
  });

  const winner = determineWinner(currentSquares);
  let status;
  let gameEnded;
  if (winner) {
    status = "Winner: " + winner;
    gameEnded = true;
  } else {
    status = `Next player:   ${currentTurn[0]} (${currentTurn[1]})`;
  }

  
  function RestartButton(){
    function restartGame(){
      navigate('/');
    }
    if (!gameEnded){
      return;
    } else {
    return (<Button onClick={restartGame} variant="contained">Restart</Button>);
  }
  }

  return (
    <div className="game">
      <Typography className="status"><b><u>{status}</u></b></Typography>
      <div className="game-board">
        <Board currentTurn={currentTurn} squares={currentSquares} onPlay={handlePlay} playerSymbol={players[0]} />
        <Board currentTurn={currentTurn} squares={currentSquares} onPlay={handlePlay} playerSymbol={players[1]} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      <RestartButton/>
    </div>
  )
}

function determineWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}