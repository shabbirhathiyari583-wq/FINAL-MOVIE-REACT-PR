
import { Link, useParams } from "react-router-dom";

function MovieDetail({ movies }) {
  const { id } = useParams();

  const movie = movies.find(
    (item) => Number(item.id) === Number(id)
  );

  if (!movie) {
    return (
      <div className="container mt-5">
        <h3>Movie not found</h3>
        <Link to="/" className="btn btn-primary">Back to Movies</Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <img src={movie.image} alt={movie.title} className="img-fluid rounded" />
        </div>

        <div className="col-md-8">
          <h1>{movie.title}</h1>
          <p>Year: {movie.year}</p>
          <p>Genre: {movie.genre}</p>
          <p>Rating: ⭐ {movie.rating}</p>
          <p>{movie.description}</p>
          <Link to="/" className="btn btn-primary">Back to Movies</Link>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
