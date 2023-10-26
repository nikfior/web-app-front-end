import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const List = ({ items, queries, removeItem, editItem }) => {
  //

  const [statusRefresher, setStatusRefresher] = useState(-1);

  useEffect(() => {
    // console.log(items);
    // console.log(queries);
    /*
    const refreshTimer = setInterval(() => {
      //console.log("beep " + statusRefresher);
    }, 4000);
    setStatusRefresher(refreshTimer);
        */
    //console.log("IN EFFECT " + statusRefresher);
    //
  }, []);
  //console.log("OUTSIDE EFFECT " + statusRefresher);
  let navigate = useNavigate();

  return (
    <div className="sites-list">
      {items.map((item) => {
        const { id, url, scrapeStatus, analyses } = item;
        return (
          <article
            className="sites-item"
            key={id}
            onClick={(e) => {
              //console.log("CLEAR " + statusRefresher);
              // clearInterval(statusRefresher);
              navigate(`/analysis?id=${id}${queries[id] || ""}`);
            }}
          >
            <p className="title" style={{ cursor: "pointer" }}>
              {url}
            </p>
            <div className="btn-container" style={{ display: "flex" }}>
              <button
                type="button"
                className="edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  editItem(id);
                }}
              >
                <FaEdit />
              </button>
              <button
                type="button"
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(id);
                }}
              >
                <FaTrash />
              </button>
            </div>
            <div
              style={{
                flex: "1 1 100%",
                fontSize: "smaller",
                color: scrapeStatus === "Completed scraping Ok" ? "green" : "red",
              }}
            >
              <b>Status:</b> {scrapeStatus}
            </div>
            <div>
              {analyses.map((analysis) => {
                return (
                  <div style={{ whiteSpace: "pre-line" }} key={analysis.savedAnalysisId}>
                    <p style={{ fontSize: "smaller" }}>
                      <b>Status:</b> {analysis.analysisStatus}
                    </p>
                    {JSON.stringify(analysis.parameters, null, 1)}
                  </div>
                );
              })}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default List;
