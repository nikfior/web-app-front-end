import React, { useEffect, useState } from "react";
// import * as React from 'react';
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import ReactJson from "react-json-view";
import getDataCheckSession from "./getDataCheckSession";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { DataGrid } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import { TagCloud } from "react-tagcloud";
import { IconButton, SvgIcon, Tab, Tabs } from "@mui/material";
import { TabPanel, TabList, TabContext } from "@mui/lab";
import { Graphviz } from "graphviz-react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArchiveIcon from "@mui/icons-material/Archive";
import Paper from "@mui/material/Paper";
import ListItemButton from "@mui/material/ListItemButton";
import Grid from "@mui/material/Grid";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { ReactComponent as KmeansIcon } from "./assets/kmeans.svg";
import { ReactComponent as SingleLinkIcon } from "./assets/singlelink.svg";
import { ReactComponent as CompleteLinkIcon } from "./assets/completelink.svg";

import "./Analysis.css";

const parserForDomInstance = new DOMParser();

const drawerWidth = 240;

const Analysis = () => {
  const [data, setData] = useState("");
  const [extraData, setExtraData] = useState("");
  const [datatag, setDatatag] = useState([[{ value: "loading", count: 0 }]]);
  const [gridData, setGridData] = useState(0);
  const [gridData2, setGridData2] = useState(0);
  const [dotData, setDotData] = useState("");
  const [gspanOutData, setGspanOutData] = useState("");
  const [valueTabNodeRenderedDoms, setValueTabNodeRenderedDoms] = useState("0");
  const [valueTabDotGraphAndRender, setValueTabDotGraphAndRender] = useState("0");
  const [valueTabDotRendersSubdir, setValueTabDotRendersSubdir] = useState("0");
  const [dataDotgraphTrees, setDataDotgraphTrees] = useState("");
  const [dataMaxAllres, setDataMaxAllres] = useState("");
  const [dataClusteredBow, setDataClusteredBow] = useState("");
  const [methodDigraphLabelStylize, setMethodDigraphLabelStylize] = useState("digraphLabelStylizeKmeans");
  const [methodNodelabelandcolorstylize, setMethodNodelabelandcolorstylize] = useState(
    "nodeLabelAndColorStylizeKmeans"
  );
  const [bottomNavigationValue, setBottomNavigationValue] = React.useState(0);

  const navigate = useNavigate();

  const makeGridData = (data) => {
    const subdirsnameWithoutDomain = data.subdirsname.map((x) => {
      return x.substring(x.indexOf("/", 8));
    });

    let columns = subdirsnameWithoutDomain.map((x, i) => {
      return { field: String(i), headerName: x, minWidth: 100, flex: 1 };
    });

    // flatten nodes in one array to get names and text for the cosine similarity matrix
    const flatNodes = data.nodes.flat(10);

    columns.unshift({
      field: "-1",
      headerName: "Node",
      width: 130,
      renderCell: (params) => (
        <Tooltip
          title={flatNodes[params.id].node + ": " + flatNodes[params.id].text}
          placement="left"
          arrow
          followCursor
        >
          <span>{params.value}</span>
        </Tooltip>
      ),
    });

    let rows = [];
    for (let i = 0; i < data.cosineSimilarityPerSubd[0].length; i++) {
      let row = { id: i, "-1": flatNodes[i].id };
      for (let j = 0; j < data.cosineSimilarityPerSubd.length; j++) {
        row[j] = data.cosineSimilarityPerSubd[j][i];
      }
      rows.push(row);
    }

    setGridData({ columns, rows });

    // let columns = data.subdirsname.map((x, i) => {
    //   return { field: String(i), headerName: x, width: 130 };
    // });

    // columns.unshift({ field: "-1", headerName: "Terms", width: 130 });

    // let rows = [];
    // for (let i = 0; i < data.bm25Terms.length; i++) {
    //   let row = { id: i, "-1": data.bm25Terms[i] };
    //   for (let j = 0; j < data.bm25Matrix.length; j++) {
    //     row[j] = data.bm25Matrix[j][i];
    //   }
    //   rows.push(row);
    // }

    // setGridData({ columns, rows });

    // -----
    // // griddata2
    // let columns2 = data.subdirsname.map((x, i) => {
    //   return { field: String(i), headerName: x, width: 130 };
    // });

    // columns2.unshift({ field: "-1", headerName: "Terms", width: 130 });

    // let rowsNames = [];
    // for (let i = 0; i < data.tfidfNodesMatrix.length; i++) {
    //   let temp = 0;
    //   for (let j = 0; j < data.tfidfNodesMatrix[i].length; j++) {
    //     rowsNames.push(temp);
    //     temp++;
    //   }
    // }

    // let rows2 = [];
    // for (let i = 0; i < data.bm25Terms.length; i++) {
    //   let row = { id: i, "-1": rowsNames[i] };
    //   for (let j = 0; j < data.tfidfNodesMatrix.length; j++) {
    //     row[j] = data.tfidfNodesMatrix[j][i];
    //   }
    //   rows2.push(row);
    // }

    // setGridData2({ columns2, rows2 });
  };

  const changeClusteringMethod = (method) => {
    if (data === "") {
      console.log("data was not set");
      return;
    } else if (data === null) {
      return;
    }
    if (method === 0 || method === "kmeans") {
      setDataDotgraphTrees(data?.dotgraphTreesKmeans);
      setDataMaxAllres(data?.maxAllresKmeans);
      setDataClusteredBow(data?.clusteredBowKmeans);
      setMethodDigraphLabelStylize("digraphLabelStylizeKmeans");
      setMethodNodelabelandcolorstylize("nodeLabelAndColorStylizeKmeans");
    } else if (method === 1 || method === "singleLink") {
      setDataDotgraphTrees(data?.dotgraphTreesSingleLink);
      setDataMaxAllres(data?.maxAllresSingleLink);
      setDataClusteredBow(data?.clusteredBowSingleLink);
      setMethodDigraphLabelStylize("digraphLabelStylizeSingleLink");
      setMethodNodelabelandcolorstylize("nodeLabelAndColorStylizeSingleLink");
    } else if (method === 2 || method === "completeLink") {
      setDataDotgraphTrees(data?.dotgraphTreesCompleteLink);
      setDataMaxAllres(data?.maxAllresCompleteLink);
      setDataClusteredBow(data?.clusteredBowCompleteLink);
      setMethodDigraphLabelStylize("digraphLabelStylizeCompleteLink");
      setMethodNodelabelandcolorstylize("nodeLabelAndColorStylizeCompleteLink");
    } else {
      console.log("Passed wrong clustering method");
    }
  };

  useEffect(() => {
    document.title = "Analysis";
    window.scrollTo(0, 0);
    // TODO to include cases where query is invalid
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const savedAnalysisId = urlParams.get("savedanalysisid");

    // if(id && ([...urlParams.entries()].length)>1){

    // }

    getDataCheckSession(`${process.env.REACT_APP_BACKEND}api/sites/analysis?${urlParams.toString()}`)
      .then((dataNow) => {
        // console.log(dataNow.nodes[0][3].str);
        // console.log(dataNow);

        setData(dataNow.analysis);
        setExtraData({
          datasetSiteId: dataNow.datasetSiteId,
          url: dataNow.url,
          status: dataNow.status,
          parameters: dataNow.parameters,
        });
        setDataDotgraphTrees(dataNow.analysis?.dotgraphTreesKmeans);
        setDataMaxAllres(dataNow.analysis?.maxAllresKmeans);
        setDataClusteredBow(dataNow.analysis?.clusteredBowKmeans);

        // if there is a problem with the analysis, then handle it by removing the loading icons and showing No Data and also showing whatever data exists
        if (dataNow.analysis === null) {
          const loadingIcons = document.querySelectorAll(
            "span.MuiCircularProgress-root.MuiCircularProgress-indeterminate"
          );
          loadingIcons.forEach((x) => {
            const newEl = document.createElement("P");
            newEl.textContent = "No Data";
            x.replaceWith(newEl);
          });
        }
        // makeGridData(data.analysis);

        // setDotData(data.analysis.dotgraphTreesKmeans);

        // setGspanOutData(data.analysis.gspanOut);
        // console.log(data.analysis.gspanOut);
        // console.log(data.analysis.backRenderedDoms);
        // let tdatatag = [[], [], [], [], [], []];
        // console.log(data);
        // let tdatatag = [];
        // for (let i = 0; i < 6; i++) {
        //   tdatatag[i] = Object.entries(data.analysis.testbow[i]).map((entry) => {
        //     // console.log(entry[0]);
        //     const ret = { value: entry[0], count: entry[1] };
        //     return ret;
        //   });
        // }

        // const tdatatag = [
        //   { value: "JavaScript", count: 38 },
        //   { value: "React", count: 30 },
        //   { value: "Nodejs", count: 28 },
        //   { value: "Express.js", count: 25 },
        //   { value: "HTML5", count: 33 },
        //   { value: "MongoDB", count: 18 },
        //   { value: "CSS3", count: 20 },
        // ];
        // setDatatag(tdatatag);
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

  const handleChangeTabNodeRenderedDoms = (event, newValue) => {
    setValueTabNodeRenderedDoms(newValue);
  };

  const handleChangeTabDotGraphAndRenders = (event, newValue) => {
    // also reset subdir tab to one
    setValueTabDotRendersSubdir("0");
    // handleChangeTabDotRendersSubdir(null, 1);

    setValueTabDotGraphAndRender(newValue);
  };

  const handleChangeTabDotRendersSubdir = (event, newValue) => {
    setValueTabDotRendersSubdir(newValue);
  };

  // TODO check how I can make the BOW ReactJson go above the map elements
  return (
    <div>
      <Box sx={{ display: "flex", flexDirection: "column", flexWrap: "nowrap", alignItems: "center" }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              onClick={(e) => navigate(-1)}
              size="large"
              edge="start"
              color="inherit"
              aria-label="back"
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {"Analysis: " + (extraData.url ?? "")}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              {[
                "Status",
                "Nodes",
                "Clustering Details",
                "Clustered BOW",
                "DOT graph tree graphs",
                "DOT graph Rendered DOMs",
                "Clustered Rendered DOMs",
              ].map((text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton
                    onClick={(event) => {
                      document.querySelectorAll("section")[index].scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <ListItemIcon>{index % 2 === 0 ? <StarBorderIcon /> : <StarIcon />}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            {/* <List>
              {["All mail", "Trash", "Spam"].map((text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List> */}
          </Box>
        </Drawer>

        {extraData.parameters ? (
          <section
            className="section-center section-center-flexwithsidenavbar"
            style={{ maxWidth: "50vw", width: "50vw", display: "flex", flexDirection: "column" }}
          >
            <table rules="all" style={{ borderStyle: "solid" }}>
              <tbody>
                {Object.entries(extraData.parameters).map((par, index) => {
                  return (
                    <tr key={index}>
                      <th
                        style={{
                          textAlign: "left",
                          paddingRight: "1rem",
                          padding: "0.5rem",
                        }}
                      >
                        {par[0] + ":"}
                      </th>
                      <td style={{ padding: "0.5rem" }}>{String(par[1])}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        ) : (
          <section
            className="section-center section-center-flexwithsidenavbar"
            style={{
              maxWidth: "50vw",
              width: "50vw",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {extraData.status ? (
              <p style={{ fontWeight: "bold", borderStyle: "solid" }}>Status: {extraData.status}</p>
            ) : null}

            <span style={{ fontWeight: "bold" }}>
              <div
                style={{ display: "flex", justifyContent: "center", marginTop: "15%", marginBottom: "5%" }}
              >
                <CircularProgress />
              </div>
            </span>
          </section>
        )}

        <Box sx={{ display: "flex" }}>
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <section className="section-center section-center-flexwithsidenavbar">
                  {!data ? (
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "18%" }}>
                      <CircularProgress />
                    </div>
                  ) : (
                    data.nodes.map((subDir, index) => {
                      return (
                        <React.Fragment key={index}>
                          <p style={{ marginTop: "1.25rem" }}>
                            <span style={{ fontWeight: "bold" }}>Sub-directory: </span>
                            {" " + data.subdirsname[index]}
                          </p>

                          <ReactJson
                            style={{ marginBottom: "1.25rem" }}
                            name={false}
                            collapsed={[2, true]}
                            displayDataTypes={false}
                            src={subDir.map((item) => {
                              // data.nodes[1] is next subdirectory
                              return { id: item.id, node: item.node, text: item.text, terms: item.terms };
                              // <div key={item.id} style={{ marginTop: "15%" }}>
                              //   <p>
                              //     <span style={{ fontWeight: "bold" }}>id: </span> {item.id}
                              //   </p>
                              //   <p>
                              //     <span style={{ fontWeight: "bold" }}>node: </span> {item.node}
                              //   </p>
                              //   <p>
                              //     <span style={{ fontWeight: "bold" }}>text: </span> {item.text}
                              //   </p>
                              //   <p style={{ fontWeight: "bold", marginBottom: 0 }}>terms:</p>
                              //   <ReactJson collapsed={true} name={false} src={item.terms} />
                              // </div>
                            })}
                          />
                          <Divider></Divider>
                        </React.Fragment>
                      );
                    })
                  )}
                </section>
              </Grid>

              <Grid item xs={6} container direction="column" spacing={2}>
                <Grid item>
                  {!dataMaxAllres ? (
                    <section className="section-center section-center-flexwithsidenavbarsecondcolumn">
                      <div style={{ display: "flex", justifyContent: "center", marginTop: "18%" }}>
                        <CircularProgress />
                      </div>
                    </section>
                  ) : (
                    <section className="section-center section-center-flexwithsidenavbarsecondcolumn">
                      <p>
                        <span style={{ fontWeight: "bold" }}>Cluster Details: </span>
                      </p>

                      <ReactJson name={false} collapsed={true} displayDataTypes={false} src={dataMaxAllres} />
                    </section>
                  )}
                </Grid>
                <Grid item>
                  {!dataClusteredBow ? (
                    <section className="section-center section-center-flexwithsidenavbarsecondcolumn">
                      <div style={{ display: "flex", justifyContent: "center", marginTop: "18%" }}>
                        <CircularProgress />
                      </div>
                    </section>
                  ) : (
                    <section className="section-center section-center-flexwithsidenavbarsecondcolumn">
                      <p>
                        <span style={{ fontWeight: "bold" }}>Clustered Bow: </span>
                      </p>

                      <ReactJson
                        name={false}
                        collapsed={true}
                        displayDataTypes={false}
                        src={dataClusteredBow}
                      />
                    </section>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* <section className="section-center section-center-flexwithsidenavbar" style={{ maxHeight: "50rem" }}>
        <>{console.log(dotData)}</>
        {dotData?
        <Graphviz
          dot={dotData[0].join("\n")}
          options={{ height: "230", zoom: true }}  
        />: <div style={{ display: "flex", justifyContent: "center", marginTop: "18%" }}>
        <CircularProgress />
      </div>
      }
      </section> */}

        {/* -------tab section for rendering the frequent dot graph trees-------- */}
        <section
          className="section-center section-center-flexwithsidenavbar"
          style={{ maxHeight: "80vh", height: "80vh", maxWidth: "70vw", width: "70vw", display: "flex" }}
        >
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={valueTabDotGraphAndRender}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChangeTabDotGraphAndRenders}
                  variant="scrollable"
                  scrollButtons
                  allowScrollButtonsMobile
                  aria-label="rendered dot graph trees"
                >
                  {dataDotgraphTrees
                    ? dataDotgraphTrees.dotGraphs.map((graph, index) => {
                        return (
                          <Tab
                            label={graph[0].substring(0, graph[0].lastIndexOf(" "))}
                            key={index}
                            value={index.toString()}
                          />
                        );
                      })
                    : null}
                </TabList>
              </Box>
              {dataDotgraphTrees ? (
                dataDotgraphTrees.dotGraphs.map((graph, index) => {
                  graph.splice(
                    1,
                    0,
                    `label="Support: ${
                      dataDotgraphTrees.dotSupport[index]
                    }\nSubdirectories: [${dataDotgraphTrees.dotWhere[index].toString()}]"`
                  );
                  return (
                    <TabPanel
                      key={index}
                      value={index.toString()}
                      style={{ height: "100%", paddingBottom: "50px" }}
                    >
                      <Graphviz
                        dot={graph.join("\n")}
                        options={{ zoom: true, width: "100%", height: "100%", fit: true }}
                        className="graphvizrestrictsize"
                      />
                    </TabPanel>
                  );
                })
              ) : (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "18%" }}>
                  <CircularProgress />
                </div>
              )}
            </TabContext>
          </Box>
        </section>

        {/* -------tab section for rendering the doms that are stylized from the frequent dot graph trees-------- */}
        <section
          className="section-center section-center-flexwithsidenavbar"
          style={{ maxHeight: "80vh", height: "80vh", maxWidth: "70vw", width: "70vw", display: "flex" }}
        >
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={valueTabDotGraphAndRender}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChangeTabDotGraphAndRenders}
                  variant="scrollable"
                  scrollButtons
                  allowScrollButtonsMobile
                  aria-label="rendered html doms"
                >
                  {dataDotgraphTrees
                    ? dataDotgraphTrees.dotGraphs.map((graph, index) => {
                        return (
                          <Tab
                            label={
                              graph[0].substring(0, graph[0].lastIndexOf(" ")) + "; "
                              //+ valueTabDotGraphAndRender // the index of the graph I am in
                            }
                            key={index}
                            value={index.toString()}
                          />
                        );
                      })
                    : null}
                </TabList>
              </Box>
              {dataDotgraphTrees ? (
                dataDotgraphTrees.dotGraphs.map((graph, index) => {
                  return (
                    <TabPanel
                      key={index}
                      value={index.toString()}
                      style={{ height: "100%", paddingBottom: "50px" }}
                    >
                      <Box sx={{ width: "100%", typography: "body1" }} style={{ height: "100%" }}>
                        <TabContext value={valueTabDotRendersSubdir}>
                          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <TabList
                              onChange={handleChangeTabDotRendersSubdir}
                              variant="scrollable"
                              scrollButtons
                              allowScrollButtonsMobile
                              aria-label="rendered html doms"
                            >
                              {data.backRenderedDoms.map((dom, index) => {
                                return (
                                  <Tab
                                    label={`Subdirectory ${dataDotgraphTrees.dotWhere[valueTabDotGraphAndRender][index]}`}
                                    key={index}
                                    value={index.toString()}
                                  />
                                );
                              })}
                            </TabList>
                          </Box>
                          {data.backRenderedDoms.map((html, index) => {
                            const dom = parserForDomInstance.parseFromString(html, "text/html");
                            dom
                              .querySelectorAll(
                                `[${methodDigraphLabelStylize}*=";${valueTabDotGraphAndRender};"]`
                              )
                              .forEach((d) => {
                                const color =
                                  d.getAttribute(methodNodelabelandcolorstylize)?.split(";")[1] || "red";
                                d.style.cssText += `;border-style: solid;border-color: ${color};border-width: thick;${
                                  d.tagName === "A" && d.childNodes.length !== 1 ? " display: block;" : ""
                                }`;
                              });
                            return (
                              <TabPanel
                                key={index}
                                value={index.toString()}
                                style={{ height: "100%", paddingBottom: "50px" }}
                              >
                                <iframe
                                  title="rendered"
                                  style={{ width: "100%", height: "100%" }}
                                  srcDoc={dom.documentElement.outerHTML}
                                ></iframe>
                              </TabPanel>
                            );
                          })}
                        </TabContext>
                      </Box>
                    </TabPanel>
                  );
                })
              ) : (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "18%" }}>
                  <CircularProgress />
                </div>
              )}
            </TabContext>
          </Box>
        </section>

        {/* -------tab section for rendering the doms that are stylized with the nodeLabels-------- */}
        <section
          className="section-center section-center-flexwithsidenavbar"
          style={{ maxHeight: "80vh", height: "80vh", maxWidth: "70vw", width: "70vw", display: "flex" }}
        >
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={valueTabNodeRenderedDoms}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChangeTabNodeRenderedDoms}
                  variant="scrollable"
                  scrollButtons
                  allowScrollButtonsMobile
                  aria-label="rendered html doms"
                >
                  {data
                    ? data.backRenderedDoms.map((html, index) => {
                        return <Tab label={data.subdirsname[index]} key={index} value={index.toString()} />;
                      })
                    : null}
                </TabList>
              </Box>
              {data ? (
                data.backRenderedDoms.map((html, index) => {
                  const dom = parserForDomInstance.parseFromString(html, "text/html");
                  dom.querySelectorAll(`[${methodNodelabelandcolorstylize}]`).forEach((d) => {
                    const color = d.getAttribute(methodNodelabelandcolorstylize).split(";")[1];
                    d.style.cssText += `border-style: solid;border-color: ${color};border-width: thick;${
                      d.tagName === "A" && d.childNodes.length !== 1 ? " display: block;" : ""
                    }`;
                  });
                  return (
                    <TabPanel
                      key={index}
                      value={index.toString()}
                      style={{ height: "100%", paddingBottom: "50px" }}
                    >
                      <iframe
                        title="rendered"
                        style={{ width: "100%", height: "100%" }}
                        srcDoc={dom.documentElement.outerHTML}
                      ></iframe>
                    </TabPanel>
                  );
                })
              ) : (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "18%" }}>
                  <CircularProgress />
                </div>
              )}
            </TabContext>
          </Box>
        </section>
        {/* <TagCloud minSize={8} maxSize={31} tags={datatag[0]} />
      <hr></hr>
      <TagCloud minSize={8} maxSize={31} tags={datatag[1]} />
      <hr></hr>
      <TagCloud minSize={8} maxSize={31} tags={datatag[2]} />
      <hr></hr>
      <TagCloud minSize={8} maxSize={31} tags={datatag[3]} />
      <hr></hr>
      <TagCloud minSize={8} maxSize={31} tags={datatag[4]} />
      <hr></hr>
      <TagCloud minSize={8} maxSize={31} tags={datatag[5]} />
      <hr></hr> */}

        <Box sx={{ pb: 7 }}>
          <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation
              showLabels
              value={bottomNavigationValue}
              onChange={(event, newValue) => {
                setBottomNavigationValue(newValue);
                changeClusteringMethod(newValue);
              }}
            >
              <BottomNavigationAction label="Kmeans" icon={<SvgIcon component={KmeansIcon} />} />
              <BottomNavigationAction label="Single Link" icon={<SvgIcon component={SingleLinkIcon} />} />
              <BottomNavigationAction label="Complete Link" icon={<SvgIcon component={CompleteLinkIcon} />} />
            </BottomNavigation>
          </Paper>
        </Box>
      </Box>
    </div>
  );
};

export default Analysis;
