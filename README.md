# React Vite Class Components Pokémon Search App

This project is a React application built using Vite and TypeScript. It demonstrates the use of class components (no hooks are used), error boundaries, ESLint, Prettier, and Husky for code quality, along with integration with the [PokeAPI](https://pokeapi.co/). The app is structured into two main sections:
- **Top Section**: Contains a search input and a "Search" button. It retrieves a previously saved search term from local storage and uses it to make API calls.
- **Main Section**: Displays search results in a grid of cards (3 columns on large screens) with details about each Pokémon. Each card includes additional details such as height, weight, base experience, types, abilities, stats, moves, game indices, held items, and extra sections for location encounters and evolution chain details. A loader is displayed while data is being fetched.

The app is also wrapped in an `ErrorBoundary` that logs errors to the console and displays a fallback UI with a button to trigger an error for testing purposes.

---

## Features

- **React Vite Setup with TypeScript**: Bootstrapped using the React TypeScript template.
- **Class Components Only**: All components are implemented as class components to utilize lifecycle methods and state management without hooks.
- **Search Input with Local Storage**: The search term is stored in local storage so that it persists between sessions.
- **API Integration**: Uses the PokeAPI to fetch Pokémon data based on the search term. If the search term is empty, it fetches a default list.
- **Loader & Error Handling**: A loader is displayed while API calls are in progress. Error messages are shown if the request fails.
- **Grid Layout of Cards**: Displays search results in a responsive 3-column grid (adjustable for smaller screens).
- **Detailed Pokémon Cards**: Each card shows comprehensive Pokémon details and includes extra sections for location encounters and evolution chain data.
- **Error Boundary**: The entire app is wrapped in an `ErrorBoundary` that catches rendering errors, logs them, and shows a fallback UI.
- **Code Quality Tools**: ESLint, Prettier, and Husky are integrated to ensure consistent formatting and linting.

---

## Setup & Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **npm 7+** (or yarn)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/rs-react-app.git
Navigate into the Project Directory
cd rs-react-app

Install Dependencies
npm install


Set Up Code Quality Tools
ESLint: The React Vite template includes ESLint. To verify there are no linting issues, run:
npm run lint

Prettier:
Install Prettier and related plugins:
npm install -D --save-exact prettier eslint-plugin-react eslint-plugin-prettier eslint-config-prettier


Create a .prettierrc file in the root with the following content:
{
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "endOfLine": "lf"
}


Add a script in your package.json to format files:
"scripts": {
  "format:fix": "prettier --write ."
}


Husky:
Install Husky:
npm install --save-dev husky


Initialize Husky:
npx husky install


Add a pre-commit hook to run linting:
npx husky add .husky/pre-commit "npm run lint"


Run the Development Server
npm run dev
Open Your Browser Navigate to http://localhost:5173 (or the port provided by Vite) to see the application in action.

Project Structure
rs-react-app/
├── src/
│   ├── assets/             # Images and static assets
│   ├── components/         # Reusable components
│   │   ├── ErrorBoundary.tsx  # ErrorBoundary for catching errors
│   │   ├── Search.tsx         # Search input component with local storage
│   │   ├── Loader.tsx         # Loader component displayed during API calls
│   │   └── Card.tsx           # Card component displaying Pokémon details
│   ├── styles/             # CSS files for styling (grid layout, animations, etc.)
│   ├── App.tsx             # Main application component wrapped in ErrorBoundary
│   └── main.tsx            # React entry point
├── .eslintrc.js            # ESLint configuration
├── .prettierrc             # Prettier configuration
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
