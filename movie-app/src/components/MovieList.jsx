
import { Link } from "react-router-dom";

function MovieList({
  movies,
  user,
  favorites,
  watchlist,
  updateSavedMovies
}) {
  async function saveMovie(type, movie) {
    const savedMovies = type === "favorites" ? favorites : watchlist;

    if (
      savedMovies.some(
        (item) => Number(item.movieId) === Number(movie.id)
      )
    ) {
      alert("Movie already added!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.id,
          movieId: movie.id,
          title: movie.title,
          image: movie.image
        })
      });

      if (!response.ok) {
        throw new Error("Movie save nahi hui");
      }

      await updateSavedMovies();
    } catch (err) {
      alert("Movie save nahi hui. JSON Server check karein.");
    }
  }

  if (movies.length === 0) {
    return <p className="text-center mt-4">No movies found.</p>;
  }

  return (
    <div className="row">
      {movies.map((movie) => (
        <div className="col-md-4 col-lg-3 mb-4" key={movie.id}>
          <div className="card movie-card h-100">
            <img
              src={movie.image}
              className="movie-poster"
              alt={movie.title}
            />

            <div className="card-body">
              <h5 className="card-title">{movie.title}</h5>
              <p>Year: {movie.year}</p>
              <p>Genre: {movie.genre}</p>
              <p>⭐ {movie.rating}</p>

              <Link
                to={`/movie/${movie.id}`}
                className="btn btn-primary w-100 mb-2"
              >
                Details
              </Link>

              <button
                className="btn btn-outline-danger w-100 mb-2"
                onClick={() => saveMovie("favorites", movie)}
              >
                ❤️ Favourite
              </button>

              <button
                className="btn btn-outline-success w-100"
                onClick={() => saveMovie("watchlist", movie)}
              >
                + Watchlist
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MovieList;
