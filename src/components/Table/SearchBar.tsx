import React from 'react';

interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<Props> = ({ searchQuery, setSearchQuery }) => {
  return (
    <input
      className="search-input"
      type="text"
      placeholder="Search by name, email or role"
      value={searchQuery}
      onChange={e => setSearchQuery(e.target.value)}
    />
  );
};

export default SearchBar;
