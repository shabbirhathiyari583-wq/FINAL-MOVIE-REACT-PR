function MovieSearch({ search, setSearch }) {
  return (
    <input
      className="form-control mb-4"
      type="text"
      placeholder="Search movies..."
      value={search}
      onChange={(event) => setSearch(event.target.value)}
    />
  );
}

export default MovieSearch;
