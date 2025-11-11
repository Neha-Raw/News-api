import { useState, useEffect, createContext } from "react";
import "./style.css";
import {
  Grid,
  Pagination,
  Backdrop,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

export const LanguageContext = createContext("en");

function App() {
  const [backdrop, setBackdrop] = useState(true);
  const [language, setLanguage] = useState("en");
  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState("music");
  const [page, setPage] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setBackdrop(true);
      setErrorMsg("");

      try {
        // ✅ Apna RapidAPI key yah daalo
        const API_KEY = "2f1f101fb7mshae6ce8eedc8d7a4p1bcef3jsnc456353ddd0a";

        const res = await fetch(
          `https://youtube138.p.rapidapi.com/search/?q==bihar%20election%20news&hl=hi&gl=IN&hl=${language}&gl=US`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-key": API_KEY,
              "x-rapidapi-host": "youtube138.p.rapidapi.com",
            },
          }
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }

        const data = await res.json();
        console.log("✅ API Data:", data);

        if (data && data.contents) {
          const videoResults = data.contents.filter(
            (item) => item.video !== undefined
          );
          setVideos(videoResults);
        } else {
          setVideos([]);
          setErrorMsg("No videos found for this category.");
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setErrorMsg("Failed to load data. Please check API key or subscription.");
      } finally {
        setBackdrop(false);
      }
    };

    const timer = setTimeout(fetchData, 800);
    return () => clearTimeout(timer);
  }, [language, page, category]);

  const setLanguageClick = () => {
    setBackdrop(true);
    setLanguage((prev) => (prev === "en" ? "es" : "en"));
  };

  const handleChangePage = (event, value) => {
    window.scrollTo(0, 0);
    setPage(value);
    setBackdrop(true);
  };

  return (
    <div className="container" style={{ padding: "20px" }}>
      <LanguageContext.Provider value={language}>
        <h1 style={{ textAlign: "center" }}>🎬 YouTube Video Explorer</h1>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={backdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        {errorMsg && (
          <p style={{ color: "red", textAlign: "center" }}>{errorMsg}</p>
        )}

        <Grid container spacing={3}>
          {videos.map((item, index) => {
            const video = item.video;
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={video.thumbnails[0].url}
                    alt={video.title}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {video.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {video.author?.title || "Unknown Channel"}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      style={{ marginTop: "10px" }}
                      href={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                    >
                      ▶ Watch
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </LanguageContext.Provider>

      <div
        className="pagination"
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Pagination
          variant="outlined"
          count={5}
          shape="rounded"
          page={page}
          onChange={handleChangePage}
        />
      </div>
    </div>
  );
}
export default App;
