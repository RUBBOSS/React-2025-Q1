import { Component, ChangeEvent } from 'react';
import Loader from './Loader';

interface State {
  searchTerm: string;
  loading: boolean;
}

class Search extends Component<object, State> {
  constructor(props: object) {
    super(props);
    const savedSearchTerm = localStorage.getItem('searchTerm') || '';
    this.state = { searchTerm: savedSearchTerm, loading: false };
  }

  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleSearch = async () => {
    const trimmedTerm = this.state.searchTerm.trim();
    localStorage.setItem('searchTerm', trimmedTerm);
    this.setState({ loading: true });

    const event = new CustomEvent('search', { detail: trimmedTerm });
    window.dispatchEvent(event);

    await this.fetchSearchResults(trimmedTerm);

    this.setState({ loading: false });
  };

  fetchSearchResults = (term: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Results for: ${term}`);
        resolve(true);
      }, 1000);
    });
  };

  render() {
    return (
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Pokémon"
          value={this.state.searchTerm}
          onChange={this.handleInputChange}
        />
        <button onClick={this.handleSearch}>Search</button>

        {this.state.loading && <Loader />}
      </div>
    );
  }
}

export default Search;
