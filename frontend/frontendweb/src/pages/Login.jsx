import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { LOGIN } from "../graphql/userQueries";
import { useNavigate, Link } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [login, { loading }] = useMutation(LOGIN);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({
        variables: { email: form.email, password: form.password },
      });
      localStorage.setItem("token", data.login.token);
      localStorage.setItem("user", JSON.stringify(data.login.user));
      navigate("/dashboard");
    } catch (error) {
      alert(error.graphQLErrors?.[0]?.message || error.message);
    }
  };
  return (
    <div className="container mt-5">
      {" "}
      <div className="row justify-content-center">
        {" "}
        <div className="col-md-5">
          {" "}
          <div className="card shadow">
            {" "}
            <div className="card-header bg-dark text-white">
              {" "}
              <h4 className="mb-0"> Login </h4>{" "}
            </div>{" "}
            <div className="card-body">
              {" "}
              <form onSubmit={handleSubmit}>
                {" "}
                <div className="mb-3">
                  {" "}
                  <label className="form-label"> Email </label>{" "}
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />{" "}
                </div>{" "}
                <div className="mb-3">
                  {" "}
                  <label className="form-label"> Password </label>{" "}
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />{" "}
                </div>{" "}
                <button
                  type="submit"
                  className="btn btn-dark w-100"
                  disabled={loading}
                >
                  {" "}
                  {loading ? "Logging in..." : "Login"}{" "}
                </button>{" "}
              </form>{" "}
              <div className="text-center mt-3">
                {" "}
                Don't have an account?{" "}
                <Link to="/register"> Register </Link>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
export default Login;
