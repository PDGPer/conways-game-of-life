# Conway's Game of Life, built in React

[Click here to see it live.](https://conways-game-of-life-henna.vercel.app/)

I've been learning my way around frontend web development and this was suggested to me as a challenge. It was the first thing I built from scratch using React and I learned a lot about information flow, setState hooks and some of the dangers around certain functions and memory leaks. Part of freeCodeCamp's [Take Home Projects.](https://www.freecodecamp.org/learn/coding-interview-prep/take-home-projects/build-the-game-of-life)

Besides the required user stories, I also wanted my game to have the option to change the board's size, randomize the status of the cells and change the generation speed.

More about me and my work at [pdgper.com](http://pdgper.com/)

## History of the game

[Per Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970. It is a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves. It is Turing complete and can simulate a universal constructor or any other Turing machine.

## Rules of the game

The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, live or dead, (or populated and unpopulated, respectively). Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur: 

1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.

2. Any live cell with two or three live neighbours lives on to the next generation.

3. Any live cell with more than three live neighbours dies, as if by overpopulation.

4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed, live or dead; births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick. Each generation is a pure function of the preceding one. The rules continue to be applied repeatedly to create further generations. 
