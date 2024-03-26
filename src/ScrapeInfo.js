import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getDataCheckSession from "./getDataCheckSession";
import ReactJson from "react-json-view";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Typography from "@mui/material/Typography";

const ScrapeInfo = () => {
  const [scrapeData, setScrapeData] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Scraped Site Info";
    window.scrollTo(0, 0);

    // // id = window.location.pathname.split("/").pop();
    const id = new URLSearchParams(window.location.search).get("id");

    getDataCheckSession(`${process.env.REACT_APP_BACKEND}api/sites/${id}?htmlomit=true`)
      .then((data) => {
        setScrapeData(data);
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

  return (
    <div>
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
            {"Scraped site url: " + (scrapeData?.site.url ?? "")}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <section
          className="section-center"
          style={{
            minWidth: "42vw",
            maxWidth: "min-content",
            whiteSpace: "pre-line",
            overflowWrap: "anywhere",
          }}
        >
          <p>
            <span style={{ fontWeight: "bold" }}>Scraped Site info: </span>
          </p>
          {!scrapeData ? (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "15%", marginBottom: "15%" }}>
              <CircularProgress />
            </div>
          ) : (
            <>
              <ReactJson
                name={false}
                collapsed={1}
                displayDataTypes={false}
                src={scrapeData.site}
                collapseStringsAfterLength={500}
                quotesOnKeys={false}
              />
            </>
          )}
        </section>
      </Box>
    </div>
  );
};

export default ScrapeInfo;
