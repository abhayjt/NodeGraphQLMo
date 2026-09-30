import { useState } from "react";



import { useQuery, useMutation } from "@apollo/client/react";

import {
  GET_USERS,
  DELETE_USER,
  UPDATE_USER
} from "../graphql/userQueries";

function Users() {

  const {
    data,
    loading,
    error,
    refetch
  } = useQuery(GET_USERS);

  const [deleteUser] = useMutation(DELETE_USER);

  const [updateUser] = useMutation(UPDATE_USER);

  const [editingUser, setEditingUser] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    email: ""
  });

  const handleEdit = (user) => {

    setEditingUser(user.id);

    setEditForm({
      name: user.name,
      email: user.email
    });
  };

  const handleUpdate = async (id) => {

    try {

      await updateUser({
        variables: {
          id,
          name: editForm.name,
          email: editForm.email
        }
      });

      setEditingUser(null);

      await refetch();

    } catch (error) {

      alert(error.message);
    }
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this user?")) {
      return;
    }

    try {

      await deleteUser({
        variables: { id }
      });

      await refetch();

    } catch (error) {

      alert(error.message);
    }
  };

  if (loading) {

    return (
      <div className="container mt-5">
        Loading users...
      </div>
    );
  }

  if (error) {

    return (
      <div className="container mt-5">

        <div className="alert alert-danger">
          {error.message}
        </div>

      </div>
    );
  }

  return (
    <div className="container mt-5">

      <div className="d-flex justify-content-between mb-3">

        <h2>
          Users
        </h2>

        <button
          className="btn btn-primary"
          onClick={() => refetch()}
        >
          Refresh
        </button>

      </div>

      <div className="card">

        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-bordered table-hover">

              <thead className="table-dark">

                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {data?.users?.map((user, index) => (

                  <tr key={user.id}>

                    <td>
                      {index + 1}
                    </td>

                    <td>

                      {editingUser === user.id ? (

                        <input
                          className="form-control"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              name: e.target.value
                            })
                          }
                        />

                      ) : (
                        user.name
                      )}

                    </td>

                    <td>

                      {editingUser === user.id ? (

                        <input
                          className="form-control"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              email: e.target.value
                            })
                          }
                        />

                      ) : (
                        user.email
                      )}

                    </td>

                    <td>
                      {new Date(
                        user.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td>

                      {editingUser === user.id ? (

                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() =>
                              handleUpdate(user.id)
                            }
                          >
                            Save
                          </button>

                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() =>
                              setEditingUser(null)
                            }
                          >
                            Cancel
                          </button>
                        </>

                      ) : (

                        <>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() =>
                              handleEdit(user)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              handleDelete(user.id)
                            }
                          >
                            Delete
                          </button>
                        </>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Users;