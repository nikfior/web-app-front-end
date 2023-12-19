import React from "react";
import { useState, useEffect } from "react";
import getDataCheckSession from "./getDataCheckSession";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";
import ListItemIcon from "@mui/material/ListItemIcon";
import StarBorder from "@mui/icons-material/StarBorder";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import BoltIcon from "@mui/icons-material/Bolt";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
    minWidth: "min-content",
    whiteSpace: "pre",
  },
}));

const MyList = ({ items, removeItem, showAlert, refreshListItems }) => {
  //

  // const [statusRefresher, setStatusRefresher] = useState(-1);
  const [openCollapse, setOpenCollapse] = React.useState({});
  const [openForm, setOpenForm] = React.useState(false);
  const [formSiteId, setFormSiteId] = React.useState(-1);

  const handleClickOpenForm = (id) => {
    setFormSiteId(id);
    setOpenForm(true);
  };

  const handleCloseForm = (DoIanalyze) => {
    if (DoIanalyze) {
      const queries = document.getElementById("nameFormQueries").value;
      // console.log(queries); // TODO better parsing for queries. add them differently
      getDataCheckSession(
        `${process.env.REACT_APP_BACKEND}api/sites/analysis?id=${formSiteId}${queries || ""}`
      )
        .then((data) => {
          if (data.status?.startsWith("Analyzing...")) {
            showAlert("success", "Analyzing...");
            refreshListItems();
          } else {
            showAlert("error", "Something went wrong.");
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

    setFormSiteId(-1);
    setOpenForm(false);
  };

  useEffect(() => {
    // console.log("In useffect");
    // const refreshTimer = setInterval(() => {
    //   console.log("beep " + statusRefresher);
    // }, 4000);
    // setStatusRefresher(refreshTimer);
    // //console.log("IN EFFECT " + statusRefresher);
    // //
    // return () => console.log("RETURNSS");
  }, []);

  //console.log("OUTSIDE EFFECT " + statusRefresher);

  // useEffect(() => {
  //   if (openCollapse.length !== items.length) {
  //     const tempArr = new Array(items.length);
  //     for (let i = 0; i < tempArr.length; i++) {
  //       tempArr[i] = openCollapse[i] ?? false;
  //     }
  //     setOpenCollapse(tempArr);
  //   }
  // }, [items]);

  let navigate = useNavigate();

  return (
    <>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {items.map((item, index) => {
          const { id, url, scrapeStatus, analyses, fetchedFavicon } = item;
          return (
            <React.Fragment key={id}>
              <ListItem
                style={{ paddingRight: "145px" }}
                alignItems="flex-start"
                secondaryAction={
                  <div style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap" }}>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClickOpenForm(id);
                      }}
                      edge="end"
                      aria-label="delete"
                      style={{ marginRight: "0px" }}
                    >
                      <BoltIcon fontSize="large" />
                    </IconButton>
                    <ListItemButton
                      sx={{ flexGrow: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCollapse({ ...openCollapse, [id]: !openCollapse[id] });
                      }}
                    >
                      {openCollapse[id] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(id);
                      }}
                      edge="end"
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                }
              >
                <ListItemButton
                  onClick={(e) => navigate(`/scrapeInfo?id=${id}`)}
                  style={{ maxWidth: "100%", paddingRight: "16px" }}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={url.split(/https?:\/\/(?:www\.)?/)[1].toUpperCase()}
                      src={/*fetchedFavicon*/ "temp"}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primaryTypographyProps={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      title: url,
                    }}
                    primary={url}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Status:
                        </Typography>
                        <span
                          style={{
                            color:
                              scrapeStatus === "Completed scraping Ok"
                                ? "green"
                                : scrapeStatus.startsWith("Scraping...")
                                ? "darkorange"
                                : "red",
                          }}
                        >
                          {" " + scrapeStatus}
                        </span>
                      </React.Fragment>
                    }
                  />
                </ListItemButton>
              </ListItem>
              <Collapse in={openCollapse[id]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {analyses.map((analysis) => {
                    // console.log(analysis);
                    const paramValues = [];
                    return (
                      <ListItem
                        key={analysis.savedAnalysisId}
                        sx={{ pl: 4 }}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={(e) => {
                              removeItem(id, analysis.savedAnalysisId);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <HtmlTooltip
                          title={
                            analysis.parameters ? (
                              <React.Fragment>
                                <table rules="all" style={{ borderStyle: "solid" }}>
                                  <tbody>
                                    {Object.entries(analysis.parameters).map((par, index2) => {
                                      const sVal = String(par[1]);
                                      paramValues.push(sVal);
                                      return (
                                        <tr key={index2}>
                                          <th
                                            style={{
                                              textAlign: "left",
                                              paddingRight: "1rem",
                                              padding: "0.5rem",
                                            }}
                                          >
                                            {par[0] + ":"}
                                          </th>
                                          <td style={{ padding: "0.5rem" }}>{sVal}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </React.Fragment>
                            ) : (
                              ""
                            )
                          }
                          placement="bottom-end"
                          arrow
                          followCursor
                        >
                          <ListItemButton
                            onClick={(e) => {
                              e.stopPropagation();
                              // clearInterval(statusRefresher);
                              // console.log(`/analysis?id=${id}&savedanalysisid=${analysis.savedAnalysisId}`);
                              navigate(`/analysis?id=${id}&savedanalysisid=${analysis.savedAnalysisId}`);
                              // navigate(`/analysis?id=${id}${queries[id] || ""}`);
                            }}
                          >
                            {/* <ListItemText primary={analysis.savedAnalysisId} /> */}

                            <ListItemText
                              style={{
                                color:
                                  analysis.analysisStatus === "Completed analyzing Ok."
                                    ? "green"
                                    : analysis.analysisStatus.startsWith("Analyzing...")
                                    ? "darkorange"
                                    : "red",
                              }}
                            >
                              {`${analysis.analysisStatus} - {${paramValues.toString()}}`}
                            </ListItemText>
                          </ListItemButton>
                        </HtmlTooltip>
                      </ListItem>
                    );
                  })}
                </List>
              </Collapse>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          );
        })}
      </List>
      <Dialog
        open={openForm}
        onClose={(e) => {
          e.stopPropagation();
          handleCloseForm(false);
        }}
      >
        <DialogTitle>Analyze</DialogTitle>
        <DialogContent>
          <DialogContentText whiteSpace={"pre-wrap"}>
            Please enter the analysis parameters you wish to use for the site analysis.{"\n"}
            The available parameters can be seen in the{" "}
            <a href={`${process.env.REACT_APP_BACKEND}api-docs/`} target="_blank" rel="noreferrer">
              Documentation Page
            </a>
            .
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="nameFormQueries"
            label="Parameters"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleCloseForm(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleCloseForm(true);
            }}
          >
            Analyze
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  //-------------

  // return (
  //   <div className="sites-list">
  //     {items.map((item) => {
  //       const { id, url, scrapeStatus, analyses } = item;
  //       return (
  //         <article
  //           className="sites-item"
  //           key={id}
  //           onClick={(e) => {
  //             //console.log("CLEAR " + statusRefresher);
  //             // clearInterval(statusRefresher);
  //             navigate(`/analysis?id=${id}${queries[id] || ""}`);
  //           }}
  //         >
  //           <p className="title" style={{ cursor: "pointer" }}>
  //             {url}
  //           </p>
  //           <div className="btn-container" style={{ display: "flex" }}>
  //             <button
  //               type="button"
  //               className="edit-btn"
  //               onClick={(e) => {
  //                 e.stopPropagation();
  //                 editItem(id);
  //               }}
  //             >
  //               <FaEdit />
  //             </button>
  //             <button
  //               type="button"
  //               className="delete-btn"
  //               onClick={(e) => {
  //                 e.stopPropagation();
  //                 removeItem(id);
  //               }}
  //             >
  //               <FaTrash />
  //             </button>
  //           </div>
  //           <div
  //             style={{
  //               flex: "1 1 100%",
  //               fontSize: "smaller",
  //               color: scrapeStatus === "Completed scraping Ok" ? "green" : "red",
  //             }}
  //           >
  //             <b>Status:</b> {scrapeStatus}
  //           </div>
  //           <div>
  //             {analyses.map((analysis) => {
  //               return (
  //                 <div style={{ whiteSpace: "pre-line" }} key={analysis.savedAnalysisId}>
  //                   <p style={{ fontSize: "smaller" }}>
  //                     <b>Status:</b> {analysis.analysisStatus}
  //                   </p>
  //                   {JSON.stringify(analysis.parameters, null, 1)}
  //                 </div>
  //               );
  //             })}
  //           </div>
  //         </article>
  //       );
  //     })}
  //   </div>
  // );
};

export default MyList;
