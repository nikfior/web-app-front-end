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
import { Tab, Tabs } from "@mui/material";
import { TabPanel, TabList, TabContext } from "@mui/lab";
// import { Graphviz } from "graphviz-react";

const drawerWidth = 240;

const Analysis = () => {
  const [data, setData] = useState({ nodes: 0 });
  const [datatag, setDatatag] = useState([[{ value: "loading", count: 0 }]]);
  const [gridData, setGridData] = useState(0);
  const [gridData2, setGridData2] = useState(0);
  const [dotData, setDotData] = useState("");
  const [HTMLData, setHTMLData] = useState("");
  const [value, setValue] = useState("1");
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

  useEffect(() => {
    // TODO to include cases where query is invalid
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    getDataCheckSession("https://nikfior-back-end.herokuapp.com/api/sites/analysis?id=" + id)
      .then((data) => {
        // console.log(data.nodes[0][3].str);
        // console.log(data);

        setData(data.analysis);
        // makeGridData(data.analysis);

        setDotData(data.analysis.dotgraphs);
        setHTMLData(data.analysis.backRenderedDoms);
        console.log(dotData);
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // TODO check how I can make the BOW ReactJson go above the map elements
  return (
    <div>
      <section className="section-center" style={{ maxHeight: "50rem" }}>
        {/* <Graphviz
          dot={`digraph 0 { "example\nillustration\ninstance\nrepresentative\nmodel\nexemplar\ngood_example\ndeterrent_example\nlesson\nobject_lesson\ncase\nexercise\nsphere\ndomain\narea\norbit\nfield\narena\ndemesne\nland\ndomain_of_a_function\nworld\nknowledge_domain\nknowledge_base" -> "sphere\ndomain\narea\norbit\nfield\narena\ndemesne\nland\ndomain_of_a_function\nworld\nknowledge_domain\nknowledge_base\nuse\nusage\nutilization\nutilisation\nemployment\nexercise\nfunction\npurpose\nrole\nconsumption\neconomic_consumption\nusance\nuse_of_goods_and_services\nhabit\nmanipulation\nenjoyment\nutilize\nutilise\napply\nemploy\nhabituate\nexpend\npractice\nexemplifying\nillustrative\ndemonstrative\nexample\nillustration\ninstance\nrepresentative\nmodel\nexemplar\ngood_example\ndeterrent_example\nlesson\nobject_lesson\ncase\nexercise\ndocument\nwritten_document\npapers\ntext_file\nuse\nusage\nutilization\nutilisation\nemployment\nexercise\nfunction\npurpose\nrole\nconsumption\neconomic_consumption\nusance\nuse_of_goods_and_services\nhabit\nmanipulation\nenjoyment\nutilize\nutilise\napply\nemploy\nhabituate\nexpend\npractice\nsphere\ndomain\narea\norbit\nfield\narena\ndemesne\nland\ndomain_of_a_function\nworld\nknowledge_domain\nknowledge_base\nliterature\nlit\nanterior\nprior(a)\nprior\ncoordination\nrequest\nasking\npermission\nlicense\npermit" }`}
          options={{ height: "230", zoom: true }}
        /> */}
      </section>

      <section className="section-center" style={{ maxHeight: "80vh", height: "80vh" }}>
        {/* <iframe
          title="rendered"
          style={{ width: "100%", height: "100%" }}
          srcdoc={HTMLData[1] || HTMLData[0]}
        ></iframe> */}
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Item One" value="1" />
                <Tab label="Item Two" value="2" />
                <Tab label="Item Three" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">Item One</TabPanel>
            <TabPanel value="2">Item Two</TabPanel>
            <TabPanel value="3">
              <iframe
                title="rendered"
                style={{ width: "100%", height: "100%" }}
                srcdoc={HTMLData[1] || HTMLData[0]}
              ></iframe>
            </TabPanel>
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
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {/* <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Sub-directories
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
              {["subdir1", "subdir2", "subdir3", "subdir4"].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemIcon>{<InboxIcon />}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {["option1", "option2", "option3"].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer> */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />

          {/* {data.nodes === 0 ? (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "18%" }}>
              <CircularProgress />
            </div>
          ) : (
            <section className="section-center">
              <ReactJson
                collapsed={true}
                displayDataTypes={false}
                name="BOW"
                key="bow"
                src={data.allDirsBow}
              />
            </section>
          )} */}

          {gridData === 0 ? (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "18%" }}>
              <CircularProgress />
            </div>
          ) : (
            <section className="section-center" style={{ maxWidth: "70rem" }}>
              <div style={{ height: 600, width: "100%" }}>
                <DataGrid
                  rows={gridData.rows}
                  columns={gridData.columns}
                  pageSize={100}
                  rowsPerPageOptions={[100]}
                  // onCellClick={function (params) {
                  //   if (params.field === "-1") {
                  //     const flatNodes = data.nodes.flat(10);
                  //     console.log(flatNodes[params.id].node + ": " + flatNodes[params.id].text);
                  //   }
                  // }}
                  // checkboxSelection
                  // disableSelectionOnClick
                />
              </div>
            </section>
          )}

          {/* {gridData2 === 0 ? (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "18%" }}>
              <CircularProgress />
            </div>
          ) : (
            <section className="section-center">
              <div style={{ height: 600, width: "100%" }}>
                <DataGrid
                  rows={gridData2.rows2}
                  columns={gridData2.columns2}
                  pageSize={100}
                  rowsPerPageOptions={[100]}
                  // checkboxSelection
                  // disableSelectionOnClick
                />
              </div>
            </section>
          )} */}

          {data.nodes === 0 ? (
            <section className="section-center">
              <div style={{ display: "flex", justifyContent: "center", marginTop: "18%" }}>
                <CircularProgress />
              </div>
            </section>
          ) : (
            data.nodes.map((subDir, index) => {
              return (
                <section key={index} className="section-center">
                  <p>
                    <span style={{ fontWeight: "bold" }}>Sub-directory: </span>
                    {" " + data.subdirsname[index]}
                  </p>

                  <ReactJson
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
                </section>
              );
            })
          )}

          {/*  */}
        </Box>
      </Box>
    </div>
  );
};

export default Analysis;
