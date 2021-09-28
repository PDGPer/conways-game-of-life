import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import "./style.css"

// Creates an array grid with given number of rows and columns.
function createGrid(rowNumber, colNumber) {
  // Creates a row; every element is false, to represent a "dead" cell.
  const rowArray = []
  for (let i = 0; i < rowNumber; i++) {
    rowArray.push(false)
  }
  // Creates the columns by pushing rows.
  const colArray = []
  for (let i = 1; i <= colNumber; i++) {
    colArray.push(rowArray)
  }
  return colArray
}

// Checks the live cells around a given cell and
// returns the cell status as alive or dead.
function cellStatus(grid, colIndex, rowIndex) {

  let count = 0

  // Added or subtracted from the given indexes
  // to obtain the neighbors' positions.
  const neighborCoords = [
    [0, -1], // Left
    [0, 1],  // Right
    [-1, -1],// Top Left
    [-1, 0], // Top
    [-1, 1], // Top Right
    [1, -1], // Bottom Left
    [1, 0],  // Bottom
    [1, 1]   // Bottom Right
  ]

  neighborCoords.forEach(([colMod, rowMod]) => {
    // Calculates the neighbors' coordinates
    let neighborCol = colIndex - colMod
    let neighborRow = rowIndex - rowMod

    // If the resulting coordinates are outside the grid
    // they are reassigned to the opposite side of the grid,
    // creating a looping board.
    if (neighborCol < 0) {
      neighborCol = grid.length - 1
    }
    if (neighborCol > grid.length - 1) {
      neighborCol = 0
    }
    if (neighborRow < 0) {
      neighborRow = grid[0].length - 1
    }
    if (neighborRow > grid[0].length - 1) {
      neighborRow = 0
    }

    // If the neighbor is alive, ups the count.
    if (grid[neighborCol][neighborRow] === true) {
      count++
    } 
  })

  // Game rules that determine cells' status.
  // First: if alive with less than two live neighbors, cell dies.
  if (grid[colIndex][rowIndex] === true && count < 2) {
    return false
  // Second: if alive with 2 to 3 live neighbors, cell remains alive.
  } else if (grid[colIndex][rowIndex] === true && count < 4) {
    return true
  // Third: if dead with 3 live neighbors, cell comes alive.
  } else if (grid[colIndex][rowIndex] === false && count === 3) {
    return true
  // Else, remains dead.
  } else {
    return false
  }
}

// Runs the current grid through the games rules cell by cell
// and pushes the updated results into a new grid.
function updateGrid(grid) {

  const newGrid = []

  for (let col = 0; col < grid.length; col++) {
    newGrid.push([])
    for (let row = 0; row < grid[col].length; row++) {
      newGrid[col].push(cellStatus(grid, col, row))
    }
  }

  return newGrid
}

// Randomizes the status of the cells in the grid.
function randomizeCellStatus(grid) {

  const randomGrid = []

  for (let col = 0; col < grid.length; col++) {
    randomGrid.push([])
    for (let row = 0; row < grid[col].length; row++) {
      randomGrid[col].push(Math.random() > 0.7 ? true : false)
    }
  }

  return randomGrid
}

// A square button that represents each cell.
const Cell = ({rowIndex, colIndex, isAlive, setGrid, isRunning}) => {

  return (
    <button 
      // Can be clicked to change its dead or alive status.
      // Disabled if the program is running.
      onClick={isRunning? null : () => setGrid(prevGrid =>
        // The whole grid is remapped every time this happens.
        prevGrid.map((row, newRowIndex) => 
          row.map((cell, newColIndex) => 
            // When the map() finds the index of the clicked button, it inverts its status.
            (rowIndex === newRowIndex && colIndex === newColIndex) ? !cell : cell
          )
        )
      )}
      // Depending on its status, it's given a different color via CSS class.
      className={isAlive ? 'cell liveCell' : 'cell deadCell'} 
    />
  )
}

// Maps each row in the grid array to a flex div row and then
// fills that row with Cell(s) for each column in the grid.
const Grid = ({grid, setGrid, isRunning}) => {

  return grid.map((row, rowIndex) => 
    <div key={rowIndex.toString()} className='row'>
      {row.map((cell, colIndex) => 
        <Cell 
          key={rowIndex.toString() + colIndex.toString()} 
          isAlive={grid[rowIndex][colIndex]} 
          setGrid={setGrid}
          rowIndex={rowIndex}
          colIndex={colIndex} 
          isRunning={isRunning}
        />
      )}
    </div>
  )
}

// The controls available to the user (start, stop, grid size, speed).
// All controls beside speed change are disabled while grid is active,
// to avoid complications.
const Controls = ({isRunning, toggleRunning, grid, setGrid, setUpdateInterval, setColNum, setRowNum}) => {

  // The controls have a second, internal state for the user's desired number
  // of rows, columns and update speed. These values only get sent to the App
  // state when the user confirms them via button, otherwise any change in the
  // input box would automatically be reflected in the App state.
  const [desiredUpdateInterval, setDesiredUpdateInterval] = useState(200)
  const [desiredRows, setDesiredRows] = useState(11)
  const [desiredColumns, setDesiredColumns] = useState(11)

  // The update speed handler restricts the value to 100-1000ms.
  function handleDesiredIntervalChange(e) {
    let speed = e.target.value
    if (speed < 100) {
      speed = 100
    } else if (speed > 1000) {
      speed = 1000
    }
    setDesiredUpdateInterval(speed)
  }

  // The rows handler restricts them to between 3 and 50.
  function handleDesiredRows(e) {
    let rows = e.target.value
    if (rows < 3) {
      rows = 3
    } else if (rows > 50) {
      rows = 50
    }
    setDesiredRows(rows)
  }

  // Idem for columns.
  function handleDesiredColumns(e) {
    let cols = e.target.value
    if (cols < 3) {
      cols = 3
    } else if (cols > 50) {
      cols = 50
    }
    setDesiredColumns(cols)
  }

  function handleSubmit(e) {
    e.preventDefault()
  }

  // Grid change handler takes the desired rows and columns
  // from the Controls state and replaces the ones in the App
  // state; generates a new grid and replaces it as well.
  function handleGridChange(cols, rows) {
    setColNum(setDesiredColumns(cols))
    setRowNum(setDesiredRows(rows))
    setGrid(createGrid(cols, rows))
  }

  return (
    <div id='controls'>
      <form onSubmit={handleSubmit}>
        <hr className='hr-mt'></hr>

        {/*User input for number of rows*/}
        <p className='text'>Grid rows (3-50)</p>
        <input
          className='input'
          type='number'
          value={desiredRows}
          onChange={handleDesiredRows}
        ></input>
        {/*User input for number of columns*/}
        <p className='text'>Grid columns (3-50)</p>
        <input
          className='input'
          type='number'
          value={desiredColumns}
          onChange={handleDesiredColumns}
        ></input>
        {/*Grid size change button*/}
        <button 
          className={isRunning? 'button button-inactive' : 'button button-active'}
          onClick={isRunning? null : () => handleGridChange(desiredColumns, desiredRows)}
        >Change grid</button>

        <hr></hr>

        {/*User input for grid update speed*/}
        <p className='text'>Speed (100-1000 milliseconds)</p>
        <input
          className='input'
          type='number'
          value={desiredUpdateInterval}
          onChange={handleDesiredIntervalChange}
        ></input>
        {/*Speed change button*/}
        <button 
          className='button button-active'
          onClick={() => setUpdateInterval(desiredUpdateInterval)}
        >Change speed</button>

        <hr className='hr-mb'></hr>
      </form>
      
      {/*Starts / Pauses the App*/}
      <button 
        className='button button-active'
        onClick={() => toggleRunning()}>{isRunning? 'Pause' : 'Start'}
      </button>

      {/*Resets the grid*/}
      <button 
        className={isRunning? 'button button-inactive' : 'button button-active'}
        onClick={() => isRunning? null : handleGridChange(desiredColumns, desiredRows)}
      >Reset</button>

      {/*Randomizes the grid*/}
      <button
        className={isRunning? 'button button-inactive' : 'button button-active'}
        onClick={isRunning? null : () => setGrid(randomizeCellStatus(grid))}
      >Randomize</button>
    </div>
  )
}

const App = () => {
  // State for the number of columns and rows in the grid.
  const [colNum, setColNum] = useState(11)
  const [rowNum, setRowNum] = useState(11)

  // Creates a new stateful custom array grid.
  const [grid, setGrid] = useState(createGrid(colNum, rowNum))

  // Holds a stringified version of the current grid
  // right before updating, so they can be later compared.
  const previousGrid = JSON.stringify(grid)
  const nextGrid = updateGrid(grid)

  // Current running or paused state of the app.
  const [isRunning, setRunning] = useState(false)

  // State for the speed at which the grid is updated.
  const [updateInterval, setUpdateInterval] = useState(200)

  // Toggles the running state to start or pause.
  const toggleRunning = () => {
    setRunning(!isRunning)
  }

  // If the next grid is identical to the previous one 
  // (meaning no new changes will happen), the simulation is halted.
  if (isRunning === true && previousGrid === JSON.stringify(nextGrid)) {
    toggleRunning()
  }

  // If the application is running, orders a grid update
  // after the given time runs out.
  if (isRunning === true) {
    setTimeout(() => {setGrid(nextGrid)}, updateInterval)
  }

  return (
    <div id='app'>
      <Controls 
        isRunning={isRunning}
        toggleRunning={toggleRunning}
        grid={grid}
        setGrid={setGrid}
        setUpdateInterval={setUpdateInterval}
        colNum={colNum}
        rowNum={rowNum}
        setColNum={setColNum}
        setRowNum={setRowNum}
      />
      <div id='grid'>
        <Grid
          grid={grid} 
          setGrid={setGrid} 
          isRunning={isRunning} 
        />
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))