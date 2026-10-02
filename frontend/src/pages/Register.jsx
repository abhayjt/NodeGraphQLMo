import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { REGISTER } from "../graphql/userQueries";
import { useNavigate, Link } from "react-router-dom";
function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [register, { loading }] = useMutation(REGISTER);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register({
        variables: {
          name: form.name,
          email: form.email,
          password: form.password,
        },
      });
      localStorage.setItem("token", data.register.token);
      localStorage.setItem("user", JSON.stringify(data.register.user));
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
            <div className="card-header bg-primary text-white">
              {" "}
              <h4 className="mb-0"> Register </h4>{" "}
            </div>{" "}
            <div className="card-body">
              {" "}
              <form onSubmit={handleSubmit}>
                {" "}
                <div className="mb-3">
                  {" "}
                  <label className="form-label"> Name </label>{" "}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />{" "}
                </div>{" "}
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
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {" "}
                  {loading ? "Creating..." : "Register"}{" "}
                </button>{" "}
              </form>{" "}
              <div className="text-center mt-3">
                {" "}
                Already have an account? <Link to="/login"> Login </Link>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
export default Register;
