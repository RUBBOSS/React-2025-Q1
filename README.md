# React Vite Pokémon Search App

This project is a React application built using Vite and TypeScript. It demonstrates the use of functional components with hooks, error boundaries, ESLint, Prettier, and Husky for code quality, along with integration with the [PokeAPI](https://pokeapi.co/). The app is structured into two main sections:

- **Top Section**: Contains a search input and a "Search" button. It retrieves a previously saved search term from local storage and uses it to make API calls.
- **Main Section**: Displays search results in a grid of cards with details about each Pokémon. Each card includes details such as height, weight, base experience, types, abilities, stats, moves, and extra sections for location encounters and evolution chain details. A loader is displayed while data is being fetched.

The app is also wrapped in an `ErrorBoundary` that catches errors, logs them to the console, and displays a fallback UI with a button to trigger an error for testing purposes.

---

## Features

- **React Vite Setup with TypeScript**: Bootstrapped using the React TypeScript template.
- **Functional Components with Hooks**: Components are implemented as functional components using hooks for state and effects.
- **Search Input with Local Storage**: The search term is stored in local storage so that it persists between sessions.
- **API Integration**: Uses the PokeAPI to fetch Pokémon data based on the search term. If the search term is empty, it fetches a default list.
- **Loader & Error Handling**: A loader is displayed during API calls. Error messages are shown if the request fails.
- **Responsive Grid Layout**: Displays search results in a responsive grid layout.
- **Error Boundary**: The app is wrapped in an `ErrorBoundary` to catch and handle rendering errors.
- **Code Quality Tools**: Integrated ESLint, Prettier, and Husky to ensure consistent coding standards.

---

## Setup & Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **npm 7+** (or yarn)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/rs-react-app.git
   cd rs-react-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Code Quality Tools**
   - **ESLint**: Verify there are no linting issues with:
     ```bash
     npm run lint
     ```
   - **Prettier**: Format files with:
     ```bash
     npm run format:fix
     ```
   - **Husky**: Pre-commit hooks are set to run linting before commits.

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to http://localhost:5173 (or the port provided by Vite) to see the application in action.

---

## Project Structure
rs-react-app/
├── src/
│ ├── assets/ # Images and static assets
│ ├── components/ # Reusable components
│ │ ├── ErrorBoundary.tsx # ErrorBoundary for catching errors
│ │ ├── Search.tsx # Search input component with local storage
│ │ ├── Loader.tsx # Loader component displayed during API calls
│ │ └── Card.tsx # Card component displaying Pokémon details
│ ├── styles/ # CSS files for styling (grid layout, animations, etc.)
│ ├── App.tsx # Main application component wrapped in ErrorBoundary
│ └── main.tsx # React entry point
├── .eslintrc.js # ESLint configuration
├── .prettierrc # Prettier configuration
├── package.json # Project dependencies and scripts
├── tsconfig.json # TypeScript configuration
└── README.md # This file

## Running Tests

This project uses Vitest for unit testing. To run tests, use the following commands:

- Run all tests:
  ```bash
  npm run test
  ```

- Run tests with a UI:
  ```bash
  npm run test:ui
  ```

- Run tests with coverage report:
  ```bash
  npm run test:coverage
  ```
