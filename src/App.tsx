import { Component } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Search from './components/Search';
import Results from './components/Results';
import ErrorThrowingComponent from './components/ErrorThrowingComponent';
import './App.css';

interface State {
  shouldThrowError: boolean;
}

class App extends Component<object, State> {
  constructor(props: object) {
    super(props);
    this.state = { shouldThrowError: false };
  }

  // Method to reset the error state
  resetErrorState = () => {
    this.setState({ shouldThrowError: false });
  };

  render() {
    return (
      <div className="app-container">
        <ErrorBoundary resetErrorState={this.resetErrorState}>
          <Search />
          <Results />
          <button
            className="error-button"
            onClick={() => this.setState({ shouldThrowError: true })}
          >
            Trigger Error
          </button>
          <ErrorThrowingComponent shouldThrow={this.state.shouldThrowError} />
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;
