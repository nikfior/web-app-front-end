import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import List from "./List";
import Alert from "./Alert";
import getDataCheckSession from "./getDataCheckSession";

//

const MainView = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [list, setList] = useState(null);
  const [listAll, setListAll] = useState(null);
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [placeholder, setPlaceholder] = useState("url");
  const [queries, setQueries] = useState({});
  const [slowCrawl, setSlowCrawl] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name && !isEditing) {
      showAlert(true, "danger", "please enter a site url");
    } else if (isEditing) {
      const tempQueries = { ...queries };
      tempQueries[editID] = name.toString();
      setQueries(tempQueries);
      setName("");
      setEditID(null);
      setIsEditing(false);
      setPlaceholder("url");
      showAlert(true, "success", "query parameters added for future analysis");
    } else {
      // add new site for scraping

      //// e.target[0].value instead of name for better sync
      getDataCheckSession(`${process.env.REACT_APP_BACKEND}api/sites/`, "POST", { url: name, slowCrawl })
        .then((data) => {
          // showAlert(true, "danger", `${data.msg}`);
          const alertType = data.msg.startsWith("The site is being scraped") ? "success" : "danger";
          showAlert(true, alertType, data.msg);
          // setList([...list, newItem]);
          setName("");
          // show site list because onChange doesn't work if i change value programmatically
          if (listAll) {
            setList(listAll);
          }
        })
        .catch((error) => {
          if (error.message === "Credentials missing") {
            navigate("/");
          } else {
            console.log(error.name + ": " + error.message);
          }
        });
    }
  };

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };

  const clearList = () => {
    showAlert(true, "danger", "empty list");
    setList([]);
  };

  const removeItem = (id) => {
    getDataCheckSession(`${process.env.REACT_APP_BACKEND}api/sites/${id}`, "DELETE")
      .then((data) => {
        showAlert(true, "danger", `${data.msg}`);
        setList(list.filter((item) => item.id !== id));
        setListAll(listAll.filter((item) => item.id !== id));
      })
      .catch((error) => {
        if (error.message === "Credentials missing") {
          navigate("/");
        } else {
          console.log(error.name + ": " + error.message);
        }
      });
  };

  const editItem = (id) => {
    // const site = list.find((site) => site.id === id);
    setIsEditing(true);
    setEditID(id);
    // setName(JSON.stringify(site.parameters) || "");
    setName(queries[id] || "");
    setPlaceholder("enter the desired query parameters for the analysis");
  };

  useEffect(() => {
    getDataCheckSession(`${process.env.REACT_APP_BACKEND}api/sites/getMenu`)
      .then((data) => {
        const tempusername = data.username ? data.username : "";
        setUsername(tempusername);

        const tempList = data.sites.map((site) => {
          return {
            url: site.url,
            id: site.id,
            parameters: site.parameters,
            scrapeStatus: site.scrapeStatus,
            status: site.status,
            analyses: site.analyses,
          };
        });

        setList(tempList);
        setListAll(tempList);
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

  //

  return (
    <div>
      <section className="section-center">
        <form className="sites-form" onSubmit={handleSubmit}>
          {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
          <h4 style={{ marginBottom: "1.75rem", textTransform: "initial" }}>Hello {username}</h4>
          <h3>Site List</h3>

          <div className="form-control">
            <input
              type="text"
              className="sites"
              style={{ maxHeight: "4rem" }}
              placeholder={placeholder}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!isEditing && listAll) {
                  setList(listAll.filter((x) => x.url.includes(e.target.value)));
                }
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", margin: "0.5rem" }}>
              <button
                type="submit"
                className="submit-btn"
                style={{ margin: "0rem 0rem 0.5rem 0rem", maxHeight: "2rem" }}
              >
                {isEditing ? "edit" : "submit"}
              </button>
              <div
                style={{ display: "flex", flexWrap: "nowrap", flexDirection: "row", alignItems: "baseline" }}
              >
                <input
                  type="checkbox"
                  id="slowcrawl"
                  name="slowcrawl"
                  value="slowcrawl"
                  disabled={isEditing}
                  onChange={(e) => {
                    setSlowCrawl(e.target.checked);
                  }}
                />
                <label
                  htmlFor="slowcrawl"
                  style={{ marginLeft: "0.2rem", whiteSpace: "nowrap", fontSize: "0.8rem" }}
                >
                  Slower Crawl
                </label>
              </div>
            </div>
          </div>
        </form>

        {list !== null ? (
          <div className="sites-container">
            <List items={list} queries={queries} removeItem={removeItem} editItem={editItem} />
            <button className="clear-btn" onClick={clearList} disabled style={{ color: "gray" }}>
              clear items
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </div>
        )}
      </section>
    </div>
  );
};

export default MainView;
