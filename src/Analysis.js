import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import ReactJson from "react-json-view";
import getDataCheckSession from "./getDataCheckSession";

const Analysis = () => {
  const [data, setData] = useState({ nodes: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    // TODO to include cases where query is invalid
    const urlParams = new URLSearchParams(window.location.search);
    const url = urlParams.get("url");

    getDataCheckSession("https://nikfior-back-end.herokuapp.com/api/sites/search?url=" + url)
      .then((data) => {
        // console.log(data.nodes[0][3].str);
        // console.log(data);
        setData(data);
      })
      .catch((error) => {
        if (error.message === "Credentials missing") {
          navigate("/");
        } else {
          console.log(error.name + ": " + error.message);
        }
      });

    //
  }, []);

  // TODO check how I can make the BOW ReactJson go above the map elements
  return (
    <div>
      {data.nodes === 0 ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "18%" }}>
          <CircularProgress />
        </div>
      ) : (
        <section className="section-center">
          <ReactJson displayDataTypes={false} name="BOW" key="bow" src={data.allDirsBow} />
        </section>
      )}

      {data.nodes === 0 ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "18%" }}>
          <CircularProgress />
        </div>
      ) : (
        data.nodes[0].map((item) => {
          // nodes[1] is next subdirectory
          return (
            <section className="section-center" key={item.id}>
              <p>
                <span style={{ fontWeight: "bold" }}>id:</span> {item.id}
              </p>
              <p>
                <span style={{ fontWeight: "bold" }}>node:</span> {item.node}
              </p>
              <p>
                <span style={{ fontWeight: "bold" }}>text:</span> {item.text}
              </p>
              <p style={{ fontWeight: "bold", marginBottom: 0 }}>terms:</p>
              <ReactJson name={false} src={item.terms} />
            </section>
          );
        })
      )}
    </div>
  );
};

export default Analysis;
