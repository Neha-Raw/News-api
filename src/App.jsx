import { useState, useEffect, createContext, InputLabel, NativeSelect } from 'react'
import './style.css'
import { Grid, Pagination, Backdrop, CircularProgress, FormControl } from '@mui/material';
import CardComponent from './CardComponent';
import Header from './Header';
import Category from './Category';
import Sort from './Sort';
export const LanguageContext = createContext('en')

function App() {
  const [backdrop, setBackdrop] = useState(true)
  const [language, setLanguage] = useState("en")
  const [newsList, setNewsList] = useState([true])
  const [category, setCategory] = useState("Business")
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState("publishedAt")
  useEffect(() => {
    fetch(`https://newsapi.org/v2/everything?q=bihar%20election&apiKey=18fc95f877b84bc3b5334d36c71220c1&pageSize=20&language=hi&page=1&sortBy=publishedAt`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.articles);
        setBackdrop(false)
        return setNewsList(data.articles)
      })
  }, [language, page, category, sort])
  function setLanguageClick() {
    if (language === "en") {
      setBackdrop(true)
      setLanguage("es")
    }
    else {
      setLanguage("en")
    }
  }
  function handleChanagePage(value) {
    window.scrollTo(0, 0)
    setPage(value)
    setBackdrop(true)
  }
  function changeCategory(categorys) {
    setCategory(categorys)
    setBackdrop(true)
  }

  const handleSort = (event) => {
    setBackdrop(true)
    setSort(event.target.value);
  };

  return (
    <div className='container'>
      <LanguageContext.Provider value='language'>
        <div className='header'>
          <h1>Latest news</h1>
        </div>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={backdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <div className='lang'> <Header setLanguaseClick={setLanguageClick} language={language} /></div>
        <div className='sort'>
          <Sort handleSort={handleSort} sort={sort} />
        </div>
        <div className='category'>
          <Category changeCategory={changeCategory} />
        </div>
        <br />
        <br />
        <div className='content'>
          <Grid container spacing={4}>
            {newsList.length && newsList.map((newsItem, index) => {
              return <Grid item xs={4} key={index}>
                <CardComponent newsItem={newsItem} />
              </Grid>
            })}
          </Grid>
        </div>
      </LanguageContext.Provider >
      <div className='pagination'>
        <Pagination variant="outlined" count={5} shape="rounded" onChange={handleChanagePage} />
      </div>
    </div >
  )
}

export default App
