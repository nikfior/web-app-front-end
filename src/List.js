import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const List = ({ items, removeItem, editItem }) => {
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
              navigate("/analysis?url=" + url);
            }}
          >
            <p className="title">{url}</p>
            <div className="btn-container">
              <button type="button" className="edit-btn" onClick={() => editItem(id)}>
                <FaEdit />
              </button>
              <button type="button" className="delete-btn" onClick={() => removeItem(id)}>
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
