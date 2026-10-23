
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  Link
} from "react-router-dom";

import Navbar from "./components/Navbar";
import MovieList from "./components/MovieList";
import MovieSearch from "./components/MovieSearch";
import MovieDetail from "./components/MovieDetail";

const DB_URL = "http://localhost:3000";

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser")) || null;
    } catch {
      return null;
    }
  });

  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    async function loadMovies() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${DB_URL}/movies`);

        if (!response.ok) {
          throw new Error("Movies load nahi hui");
        }

        const data = await response.json();
        setMovies(data);
      } catch {
        setError("JSON Server check karein aur page refresh karein.");
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [user]);

  async function updateSavedMovies() {
    if (!user) return;

    try {
      const favResponse = await fetch(`${DB_URL}/favorites`);
      const watchResponse = await fetch(`${DB_URL}/watchlist`);

      if (!favResponse.ok || !watchResponse.ok) {
        throw new Error("Saved movies load nahi hui");
      }

      const favData = await favResponse.json();
      const watchData = await watchResponse.json();

      setFavorites(
        favData.filter(
          (item) => Number(item.userId) === Number(user.id)
        )
      );

      setWatchlist(
        watchData.filter(
          (item) => Number(item.userId) === Number(user.id)
        )
      );
    } catch (err) {
      console.log("Saved movies load nahi hui.", err);
    }
  }

  useEffect(() => {
    if (user) {
      updateSavedMovies();
    } else {
      setFavorites([]);
      setWatchlist([]);
      setMovies([]);
    }
  }, [user]);

  async function handleLogin(event) {
    event.preventDefault();

    const email = event.target.email.value.trim().toLowerCase();
    const password = event.target.password.value;

    try {
      const response = await fetch(`${DB_URL}/users`);

      if (!response.ok) {
        throw new Error("Users load nahi hue");
      }

      const users = await response.json();

      const foundUser = users.find(
        (item) =>
          item.email.trim().toLowerCase() === email &&
          item.password === password
      );

      if (!foundUser) {
        alert("Email ya password galat hai.");
        return;
      }

      localStorage.setItem(
        "currentUser",
        JSON.stringify(foundUser)
      );

      setUser(foundUser);
    } catch (err) {
      console.error(err);
      alert("Login nahi hua. JSON Server chalu hai ya nahi check karein.");
    }
  }

  async function handleRegister(event) {
    event.preventDefault();

    const name = event.target.name.value.trim();
    const email = event.target.email.value.trim().toLowerCase();
    const password = event.target.password.value;

    try {
      const response = await fetch(`${DB_URL}/users`);

      if (!response.ok) {
        throw new Error("Users load nahi hue");
      }

      const users = await response.json();

      if (
        users.some(
          (item) => item.email.trim().toLowerCase() === email
        )
      ) {
        alert("Ye email pehle se registered hai.");
        return;
      }

      const registerResponse = await fetch(`${DB_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      if (!registerResponse.ok) {
        throw new Error("Registration failed");
      }

      const newUser = await registerResponse.json();

      localStorage.setItem(
        "currentUser",
        JSON.stringify(newUser)
      );

      setUser(newUser);
    } catch (err) {
      console.error(err);
      alert("Registration nahi hui. JSON Server check karein.");
    }
  }

  function handleLogout() {
    localStorage.removeItem("currentUser");
    setUser(null);
    setSearch("");
    window.location.hash = "#/login";
  }

  function LoginPage() {
    return (
      <div className="auth-box">
        <h2 className="text-center mb-3">Movie Library</h2>
        <p className="text-center text-secondary">Login to continue</p>

        <form onSubmit={handleLogin}>
          <label className="form-label">Email</label>
          <input
            className="form-control mb-3"
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />

          <label className="form-label">Password</label>
          <input
            className="form-control mb-3"
            type="password"
            name="password"
            placeholder="Enter your password"
            required
          />

          <button className="btn btn-primary w-100" type="submit">
            Login
          </button>
        </form>

        <p className="text-center mt-3">
          New user? <Link to="/register">Register here</Link>
        </p>
      </div>
    );
  }

  function RegisterPage() {
    return (
      <div className="auth-box">
        <h2 className="text-center mb-3">Create Account</h2>

        <form onSubmit={handleRegister}>
          <label className="form-label">Name</label>
          <input
            className="form-control mb-3"
            type="text"
            name="name"
            required
          />

          <label className="form-label">Email</label>
          <input
            className="form-control mb-3"
            type="email"
            name="email"
            required
          />

          <label className="form-label">Password</label>
          <input
            className="form-control mb-3"
            type="password"
            name="password"
            minLength="4"
            required
          />

          <button className="btn btn-success w-100" type="submit">
            Register
          </button>
        </form>

        <p className="text-center mt-3">
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </div>
    );
  }

  function SavedPage({ type }) {
    const items = type === "favorites" ? favorites : watchlist;

    const savedMovies = items
      .map((item) =>
        movies.find(
          (movie) => Number(movie.id) === Number(item.movieId)
        )
      )
      .filter(Boolean);

    return (
      <div className="container mt-4">
        <h2>{type === "favorites" ? "My Favourites" : "My Watchlist"}</h2>

        <MovieList
          movies={savedMovies}
          user={user}
          favorites={favorites}
          watchlist={watchlist}
          updateSavedMovies={updateSavedMovies}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        <Route
          path="/"
          element={
            <div className="container mt-4">
              <h1 className="text-center mb-4">Explore Movies</h1>

              <MovieSearch search={search} setSearch={setSearch} />

              {loading && <p className="text-center">Loading movies...</p>}
              {error && <p className="alert alert-danger">{error}</p>}

              {!loading && !error && (
                <MovieList
                  movies={filteredMovies}
                  user={user}
                  favorites={favorites}
                  watchlist={watchlist}
                  updateSavedMovies={updateSavedMovies}
                />
              )}
            </div>
          }
        />

        <Route path="/movie/:id" element={<MovieDetail movies={movies} />} />
        <Route path="/favorites" element={<SavedPage type="favorites" />} />
        <Route path="/watchlist" element={<SavedPage type="watchlist" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
