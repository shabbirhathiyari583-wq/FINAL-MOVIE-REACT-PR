import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  function logout() {
    onLogout();
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <Link className="navbar-brand fw-bold" to="/">
        Movie Library
      </Link>

      <div className="d-flex align-items-center gap-3">
        <Link className="nav-link text-white" to="/">Home</Link>
        <Link className="nav-link text-white" to="/favorites">Favourites</Link>
        <Link className="nav-link text-white" to="/watchlist">Watchlist</Link>

        <span className="text-warning">{user.name}</span>

        <button className="btn btn-outline-light btn-sm" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
