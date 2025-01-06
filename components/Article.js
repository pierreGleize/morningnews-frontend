import { useDispatch, useSelector } from "react-redux";
import { addBookmark, removeBookmark } from "../reducers/bookmarks";
import { hideArticle, unhideArticles } from "../reducers/hiddenArticles";
import Image from "next/image";
import styles from "../styles/Article.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Article(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const description = props.description.slice(0, 150) + " ...";

  const handleBookmarkClick = () => {
    if (!user.token) {
      return;
    }

    fetch(
      `https://morningnews-backend-olive.vercel.app/users/canBookmark/${user.token}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.result && data.canBookmark) {
          if (props.isBookmarked) {
            dispatch(removeBookmark(props));
          } else {
            dispatch(addBookmark(props));
          }
        }
      });
  };
  const handleHideArticles = () => {
    dispatch(hideArticle(props.title));
  };

  let iconStyle = {};
  if (props.isBookmarked) {
    iconStyle = { color: "#E9BE59" };
  }

  return (
    <div className={styles.articles}>
      <div className={styles.articleHeader}>
        <h3>{props.title}</h3>
        <FontAwesomeIcon
          onClick={() => handleBookmarkClick()}
          icon={faBookmark}
          style={iconStyle}
          className={styles.bookmarkIcon}
        />
        {props.hideIcon && (
          <FontAwesomeIcon
            onClick={() => handleHideArticles()}
            icon={faEyeSlash}
            // style={iconStyle}
            className={styles.bookmarkIcon}
          />
        )}
      </div>
      <h4 style={{ textAlign: "right" }}>- {props.author}</h4>
      <div className={styles.divider}></div>
      <Image
        src={props.urlToImage}
        alt={props.title}
        width={600}
        height={314}
      />
      <p>{description}</p>
    </div>
  );
}

export default Article;
