import { Component } from 'react';
import Loader from './Loader';
import Card from './Card';

interface State {
  results: Array<{ name: string; url: string }>;
  loading: boolean;
  error: string | null;
}

class Results extends Component<object, State> {
  constructor(props: object) {
    super(props);
    this.state = {
      results: [],
      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    const savedSearchTerm = localStorage.getItem('searchTerm') || '';
    this.fetchResults(savedSearchTerm);
    window.addEventListener('search', this.handleSearchEvent);
  }

  componentWillUnmount() {
    window.removeEventListener('search', this.handleSearchEvent);
  }

  handleSearchEvent = (event: Event) => {
    const customEvent = event as CustomEvent;
    const searchTerm = customEvent.detail;
    this.fetchResults(searchTerm);
  };

  fetchResults = async (searchTerm: string) => {
    this.setState({ loading: true, error: null });

    try {
      const apiUrl = searchTerm
        ? `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
        : `https://pokeapi.co/api/v2/pokemon?limit=10`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch data. Please try again.');
      }

      const data = await response.json();
      const results = searchTerm
        ? [{ name: data.name, url: data.url }]
        : data.results;

      this.setState({ results, loading: false });
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.setState({ error: error.message, loading: false });
      } else {
        this.setState({ error: 'An unknown error occurred', loading: false });
      }
    }
  };

  render() {
    const { results, loading, error } = this.state;

    if (loading) return <Loader />;
    if (error) return <div className="error-message">{error}</div>;

    return (
      <div className="results-container">
        {results.map((result) => (
          <Card
            key={result.name}
            name={result.name}
            url={
              result.url || `https://pokeapi.co/api/v2/pokemon/${result.name}/`
            }
          />
        ))}
      </div>
    );
  }
}

export default Results;
