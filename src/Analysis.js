import React, { useEffect, useState } from "react";
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

const drawerWidth = 240;

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
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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
        </Drawer>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {data.nodes === 0 ? (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "18%" }}>
              <CircularProgress />
            </div>
          ) : (
            <section style={{ backgroundColor: "rgb(39, 40, 34)" }} className="section-center">
              <ReactJson
                theme="monokai"
                collapsed={true}
                displayDataTypes={false}
                name="BOW"
                key="bow"
                src={data.allDirsBow}
              />
            </section>
          )}

          {data.nodes === 0 ? (
            <section className="section-center">
              <div style={{ display: "flex", justifyContent: "center", marginTop: "18%" }}>
                <CircularProgress />
              </div>
            </section>
          ) : (
            data.nodes.map((subDir, index) => {
              return (
                <section style={{ backgroundColor: "rgb(39, 40, 34)" }} className="section-center">
                  <p style={{ color: "wheat" }}>
                    <span style={{ fontWeight: "bold" }}>Sub-directory: </span>
                    {" " + data.subdirsname[index]}
                  </p>

                  <ReactJson
                    name={false}
                    collapsed={[2, true]}
                    displayDataTypes={false}
                    theme="monokai"
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
