import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import MyList from "./MyList";
import getDataCheckSession from "./getDataCheckSession";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

//

const MainView = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const nameRef = useRef(name);
  // listAll holds all the items
  const [listAll, setListAll] = useState(null);
  // list holds only the viewable items. Some may have been temporarily removed (hidden) during the use of the search field
  const [list, setList] = useState(null);
  const [username, setUsername] = useState("");
  const [placeholder, setPlaceholder] = useState("url");
  const [slowCrawl, setSlowCrawl] = useState(false);
  const [alert, setAlert] = useState({ msg: "", type: "" });
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert("warning", "please enter a site url");
    } else {
      // add new site for scraping

      //// e.target[0].value instead of name for better sync
      getDataCheckSession(`${process.env.REACT_APP_BACKEND}api/sites/`, "POST", 60000, {
        url: name,
        slowCrawl,
      })
        .then((data) => {
          // showAlert(true, "danger", `${data.msg}`);
          const alertType = data.status?.startsWith("Scraping...") ? "success" : "error";
          showAlert(alertType, "The site is being scraped");
          // setList([...list, newItem]);
          setName("");

          // if slowCrawl is checked then click it to uncheck it because it is unchecked by default
          if (slowCrawl) {
            document.getElementById("slowcrawl").click();
          }

          // I reset the viewable list to the listAll that has all the items because they got reduced due to the search field
          if (listAll) {
            setList(listAll);
          }
          refreshListItems();
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

  const showAlert = (type = "info", msg = "") => {
    setAlert({ type, msg });
    setOpenSnackBar(true);
  };

  //TODO do something with this button
  const clearList = () => {
    showAlert("warning", "empty list");
    setList([]);
  };

  const removeItem = (id, savedAnalysisId) => {
    // console.log(id, savedAnalysisId);
    getDataCheckSession(
      `${process.env.REACT_APP_BACKEND}api/sites/${id}${
        savedAnalysisId ? "?savedanalysisid=" + savedAnalysisId : ""
      }`,
      "DELETE"
    ) // TODO better checks and remove correctly
      .then((data) => {
        if (
          data.msg === "Analysis deleted successfully" ||
          data.msg === "Site and analyses deleted successfully"
        ) {
          showAlert("success", `${data.msg}`);
          refreshListItems();
          //setList(list.filter((item) => item.id !== id));
          //setListAll(listAll.filter((item) => item.id !== id));
        } else {
          showAlert("error", `Deletion failed. ${data.msg}`);
        }
      })
      .catch((error) => {
        if (error.message === "Credentials missing") {
          navigate("/");
        } else {
          console.log(error.name + ": " + error.message);
        }
      });
  };

  // gets the items from the backend. Can be called when I want to refresh the items in the list because I added or deleted one
  const refreshListItems = () => {
    getDataCheckSession(`${process.env.REACT_APP_BACKEND}api/sites/getMenu`, "GET", 3500)
      .then((data) => {
        const tempusername = data.username ? data.username : "";
        setUsername(tempusername);

        const tempList = data.sites.map((site) => {
          return {
            url: site.url,
            id: site.id,
            scrapeStatus: site.scrapeStatus,
            analyses: site.analyses,
            fetchedFavicon: `${new URL(site.url).origin}/favicon.ico`,
          };
        });

        // console.log(name);
        // console.log(nameRef.current);
        // setList(tempList);
        setList(tempList.filter((x) => x.url.includes(nameRef.current)));
        setListAll(tempList);
      })
      .catch((error) => {
        if (error.message === "Credentials missing") {
          navigate("/");
        } else {
          console.log(error.name + ": " + error.message);
        }
      });
  };

  useEffect(() => {
    document.title = "Main Menu";
    refreshListItems();

    // TODO make it auto-refresh only when there are Analyzing... and Scraping... statuses. Alternatively I could also implement a websockets or SSE solution
    const refreshTimer = setInterval(() => {
      refreshListItems();
      // If i change the refresh rate, make sure to also change the timeout time in the refreshListItems' getDataCheckSession function so that it is less than the refresh rate so that if the backend disconnects it would not get flooded with piling fetch requests
    }, 5000);

    return () => clearInterval(refreshTimer);
    //
  }, []);

  // needed in order for the live search in the text field to work while refreshing
  useEffect(() => {
    nameRef.current = name;
  }, [name]);

  //

  return (
    <div>
      <section className="section-center" style={{ maxWidth: "80ch" }}>
        <form className="sites-form" onSubmit={handleSubmit}>
          <h4 style={{ marginBottom: "1.75rem", textTransform: "initial" }}>
            Hello <span style={{ fontWeight: "800" }}>{username}</span>
            <span>
              {" "}
              ({/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                href=""
                style={{ color: "red" }}
                onClick={() =>
                  (document.cookie = "jwttokenFront=; expires=Thu, 01 Jan 1970 00:00:01 UTC; path=/;")
                }
              >
                Logout
              </a>
              )
            </span>
          </h4>

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
                if (listAll) {
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
                submit
              </button>
              <div
                style={{ display: "flex", flexWrap: "nowrap", flexDirection: "row", alignItems: "baseline" }}
              >
                <input
                  type="checkbox"
                  id="slowcrawl"
                  name="slowcrawl"
                  value="slowcrawl"
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
            <MyList
              items={list}
              removeItem={removeItem}
              showAlert={showAlert}
              refreshListItems={refreshListItems}
            />
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
      <Snackbar
        open={openSnackBar}
        autoHideDuration={3500}
        onClose={() => {
          setOpenSnackBar(false);
        }}
      >
        <Alert
          onClose={() => {
            setOpenSnackBar(false);
          }}
          severity={alert.type}
          sx={{ width: "100%" }}
        >
          {alert.msg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MainView;
