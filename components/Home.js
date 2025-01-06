import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Head from "next/head";
import Article from "./Article";
import TopArticle from "./TopArticle";
import styles from "../styles/Home.module.css";

function Home() {
  const bookmarks = useSelector((state) => state.bookmarks.value);
  const articlesHidden = useSelector((state) => state.hiddenArticles.value);

  const dispatch = useDispatch();

  const [articlesData, setArticlesData] = useState([]);
  const [topArticle, setTopArticle] = useState({});

  useEffect(() => {
    fetch("https://morningnews-backend-olive.vercel.app/articles")
      .then((response) => response.json())
      .then((data) => {
        setTopArticle(data.articles[0]);
        setArticlesData(data.articles.filter((data, i) => i > 0));
      });
  }, []);

  const articles = articlesData.map((data, i) => {
    const article1 = articlesHidden.includes(data.title);

    const isBookmarked = bookmarks.some(
      (bookmark) => bookmark.title === data.title
    );
    console.log(article1, articlesHidden);
    return article1 ? null : (
      <Article key={i} {...data} isBookmarked={isBookmarked} hideIcon={true} />
    );
  });

  let topArticles;
  if (bookmarks.some((bookmark) => bookmark.title === topArticle.title)) {
    topArticles = <TopArticle {...topArticle} isBookmarked={true} />;
  } else {
    topArticles = <TopArticle {...topArticle} isBookmarked={false} />;
  }

  return (
    <div>
      <Head>
        <title>Morning News - Home</title>
      </Head>
      {topArticles}
      <div className={styles.articlesContainer}>{articles}</div>
    </div>
  );
}

export default Home;
