# Tic Tac Toe

## Tech Stack

![HTML5](https://img.shields.io/badge/HTML5-Markup-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Styles-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Frontend](https://img.shields.io/badge/Frontend-UI-orange?style=for-the-badge)

A simple browser-based **Tic Tac Toe** game built using **HTML, CSS and vanilla JavaScript**.  
The game supports **two players (X vs O)** on the same device, with automatic **win / draw detection** and a **restart** button.

---

## Overview

This project focuses on:

- Building a clean, responsive **3x3 game grid** using CSS Grid
- Implementing **turn-based game logic** in JavaScript
- Detecting **winning combinations** and **draws**
- Displaying a **full-screen overlay** for the final result (Win / Draw)

The goal of the project is to practice **core web fundamentals (HTML/CSS/JS)** and simple **game logic** without using any frameworks.

---

## ✅ Features

### Gameplay

- Two-player **X vs O** on the same device
- The current player is indicated through **hover effects** on the board
- Cells can be clicked **only once** (thanks to `{ once: true }` in the event listener)

### Win Detection

- Based on predefined winning combinations:
  ```js
  const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  ```
- Checks for a win after every move
- Displays a winning overlay message when a player wins

### Draw Detection

- If all 9 cells are taken without a winner, the game ends in a Draw
- A draw message is shown in the same overlay

### Learning Outcomes

Through this project I practiced:

- Structuring a small project with HTML, CSS and JS
- Using CSS Grid and CSS variables for layout and sizing
- Working with DOM events (addEventListener, { once: true })
- Building a clean, reusable win/draw detection system
