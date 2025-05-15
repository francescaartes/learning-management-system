import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import TeachWithUs from "../assets/teach_with_us.png";

const StartTeachingPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [page, setPage] = useState("");

  return (
    <>
      <section style={{ height: "100dvh" }} className="bg-light h-100">
        <div className="container" style={{ height: "100%" }}>
          <div className="row h-100">
            <div className="col-md-6 d-flex align-items-center flex-column justify-content-center order-1 order-lg-0 order-md-0 mt-2">
              <div className="w-75">
                <h1 className="display-5 fw-bold">Come teach with us</h1>
                <p className="lead">
                  Become an instructor and change lives — including your own.
                </p>
                <button
                  className="btn btn-primary mt-3 w-100"
                  onClick={user ? "" : navigate("/login")}
                >
                  Get started
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <img
                src={TeachWithUs}
                alt="Teach with us"
                className="img-fluid h-100 object-fit-contain"
                style={{ maxHeight: "600px" }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StartTeachingPage;
