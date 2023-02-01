import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const List = ({ items, queries, removeItem, editItem }) => {
  let navigate = useNavigate();

  return (
    <div className="sites-list">
      {items.map((item) => {
        const { id, url } = item;
        return (
          <article
            className="sites-item"
            key={id}
            onClick={(e) => {
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
          </article>
        );
      })}
    </div>
  );
};

export default List;
