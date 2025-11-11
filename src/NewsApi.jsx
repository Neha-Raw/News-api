import { useState, useEffect } from "react";
import {
  Grid,
  Backdrop,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Pagination,
} from "@mui/material";
import "./style.css";

function App() {
  const [backdrop, setBackdrop] = useState(true);
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setBackdrop(true);
      setErrorMsg("");

      try {
        // 🧩 अपनी NewsAPI key यहाँ डालो
        const API_KEY = "18fc95f877b84bc3b5334d36c71220c1";

        const res = await fetch(
          `https://newsapi.org/v2/everything?q=bihar%20election&apiKey=${API_KEY}&pageSize=20&language=hi&page=${page}&sortBy=publishedAt`
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }

        const data = await res.json();
        console.log("✅ API Data:", data);

        if (data && data.articles) {
          setNews(data.articles);
        } else {
          setNews([]);
          setErrorMsg("कोई समाचार नहीं मिला।");
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setErrorMsg("डेटा लोड करने में समस्या आई। कृपया API key या नेटवर्क जांचें।");
      } finally {
        setBackdrop(false);
      }
    };

    fetchData();
  }, [page]);

  const handleChangePage = (event, value) => {
    window.scrollTo(0, 0);
    setPage(value);
  };

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>🗳️ बिहार चुनाव समाचार</h1>

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
        {news.map((article, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              {article.urlToImage && (
                <CardMedia
                  component="img"
                  height="200"
                  image={article.urlToImage}
                  alt={article.title}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {article.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{ marginTop: "10px" }}
                  href={article.url}
                  target="_blank"
                >
                  पूरा समाचार पढ़ें →
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
