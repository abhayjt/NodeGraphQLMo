import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">

      <div className="container">

        <Link
          className="navbar-brand"
          to="/dashboard"
        >
          User Management
        </Link>

        <div className="navbar-nav ms-auto">

          {token && (
            <>
              <Link
                className="nav-link"
                to="/dashboard"
              >
                Dashboard
              </Link>

              <Link
                className="nav-link"
                to="/users"
              >
                Users
              </Link>

              <button
                className="btn btn-danger ms-3"
                onClick={logout}
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;