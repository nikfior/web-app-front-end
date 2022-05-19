import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import Login from "./Login";
import MainView from "./MainView";
import Analysis from "./Analysis";
import getDataCheckSession from "./getDataCheckSession";

//

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    getDataCheckSession()
      .then(() => {
        navigate("/view");
      })
      .catch((error) => {
        if (error.message === "Credentials missing") {
          const urlParams = new URLSearchParams(window.location.search);
          const jwttoken = urlParams.get("jwttoken");
          if (jwttoken) {
            document.cookie = "jwttokenFront=" + jwttoken + ";max-age=2592000";
            navigate("/view");
          }
        } else {
          console.log(error.name + ": " + error.message);
        }
      });

    //
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/view" element={<MainView />} />
      <Route path="/analysis" element={<Analysis />} />
    </Routes>
  );
}

export default App;
