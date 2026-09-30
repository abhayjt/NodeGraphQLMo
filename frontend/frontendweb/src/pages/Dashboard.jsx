import { useQuery } from "@apollo/client/react";
import { GET_ME } from "../graphql/userQueries";

function Dashboard() {

    const {
        data,
        loading,
        error
    } = useQuery(GET_ME);


    if (loading) {

        return (
            <div className="container mt-5">
                <div className="alert alert-info">
                    Loading...
                </div>
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

            <h2 className="mb-4">
                Dashboard
            </h2>

            <div className="card shadow">

                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                        User Profile
                    </h5>
                </div>

                <div className="card-body">

                    <h4>
                        Welcome, {data?.me?.name}
                    </h4>

                    <hr />

                    <p>
                        <strong>User ID:</strong>{" "}
                        {data?.me?.id}
                    </p>

                    <p>
                        <strong>Name:</strong>{" "}
                        {data?.me?.name}
                    </p>

                    <p>
                        <strong>Email:</strong>{" "}
                        {data?.me?.email}
                    </p>

                    <p>
                        <strong>Created:</strong>{" "}
                        {data?.me?.createdAt
                            ? new Date(
                                data.me.createdAt
                            ).toLocaleString()
                            : "N/A"}
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;

