import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import classNames from 'classnames';
import uniqid from 'uniqid';
import { Popover } from 'antd';

import {
  fetchDeleteArticle,
  fetchFavoriteArticle,
  fetchUnfavoriteArticle,
} from '../../store/fetchSlice';
import Tag from '../Tag';
import { useAppDispatch, useAppSelector, useDetectOverflow } from '../../hooks';
import like from '../../assets/icons/like.svg';
import likeFill from '../../assets/icons/likeFill.svg';
import { Article } from '../../models/articles';
import warningIcon from '../../assets/icons/warning.svg';

import classes from './ArticleHeader.module.scss';

export default function ArticleHeader({
  article,
  isStandalone = true,
}: {
  article: Article;
  isStandalone: boolean;
}) {
  const history = useHistory();
  const token = localStorage.getItem('token');
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [isTitleOverflow, titleRef] = useDetectOverflow<HTMLHeadingElement>('horizontal');
  const [isDescriptionOverflow, descriptionRef] =
    useDetectOverflow<HTMLParagraphElement>('vertical');
  const {
    loading,
    isDeleteSucsess,
    usersFetchData: { currentUser },
  } = useAppSelector((state) => state.fetchSlice);
  const dispatch = useAppDispatch();
  let currentUsername;

  if (currentUser) {
    currentUsername = currentUser.username;
  }

  const articleCreationDate = () => {
    const partsDate = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).formatToParts(new Date(article.createdAt));
    return `${partsDate[2].value} ${partsDate[0].value}, ${partsDate[4].value}`;
  };

  const headerClasses = classNames({
    [classes.article__header]: true,
    [classes['article__header--standalone']]: isStandalone,
    [classes['article__header--full']]: !isStandalone,
  });

  const titleClasses = classNames({
    [classes['article__title-wrap']]: true,
    [classes['article__title-wrap__popup']]: isTitleOverflow,
  });

  const descriptionClasses = classNames({
    [classes['article__description-wrap']]: true,
    [classes['article__description-wrap__popup']]: isDescriptionOverflow,
    [classes['article__description-wrap--full']]: !isStandalone,
  });

  const tagItems = article.tagList
    .filter((tag) => tag?.match(/\S/))
    .map((tag) => (
      <li key={`${article.slug}-${tag}-${uniqid.time()}`}>
        <Tag tag={tag} />
      </li>
    ));

  const handleOpenChange = (newOpen: boolean) => {
    setDeletePopupOpen(newOpen);
  };

  useEffect(() => {
    if (!loading && isDeleteSucsess) {
      history.push('/');
    }
  }, [isDeleteSucsess]);

  function handleLike() {
    if (token) {
      if (!article.favorited) {
        dispatch(fetchFavoriteArticle({ token, slug: article.slug }));
      } else {
        dispatch(fetchUnfavoriteArticle({ token, slug: article.slug }));
      }
    }
  }

  const likeClasses = classNames(classes.like, {
    [classes['like--disabled']]: !token,
  });

  return (
    <header className={headerClasses}>
      <div className={classes.article__header__top}>
        <div className={classes.article__info}>
          <div className={titleClasses} data-content={article.title}>
            <Link className={classes.article__link} to={`/articles/${article.slug}`}>
              <h2 ref={titleRef} className={classes.article__title}>
                {article.title}
              </h2>
            </Link>
            <button type="button" className={likeClasses} onClick={handleLike}>
              {article.favorited ? (
                <img className={classes.like__icon} src={likeFill} alt="Like fill icon" />
              ) : (
                <img className={classes.like__icon} src={like} alt="Like icon" />
              )}
              <span className={classes.like__count}>{article.favoritesCount}</span>
            </button>
          </div>
          {tagItems.length ? <ul className={classes['article__tag-list']}>{tagItems}</ul> : null}
        </div>
        <div className={classes['article__additional-info']}>
          <div className={classes['article__additional-info__text']}>
            <span className={classes.author__name}>{article.author.username}</span>
            <span className={classes['article__creation-date']}>{articleCreationDate()}</span>
          </div>
          <img className={classes.author__avatar} src={article.author.image} alt="Author avatar" />
        </div>
      </div>
      <div className={classes.article__header__bottom}>
        {article.description?.match(/\S/) ? (
          <div className={descriptionClasses} data-content={article.description}>
            <p ref={descriptionRef} className={classes.article__description}>
              {article.description}
            </p>
          </div>
        ) : null}
        {token && article.author.username === currentUsername && !isStandalone && (
          <div className={classes['article__change-buttons-wrap']}>
            <Popover
              placement="rightTop"
              trigger="click"
              open={deletePopupOpen}
              onOpenChange={handleOpenChange}
              content={
                <div className={classes.delete__popup}>
                  <div className={classes['delete__warning-message']}>
                    <img
                      className={classes['delete__warning-message__icon']}
                      src={warningIcon}
                      aria-hidden
                      alt="Warning Icon"
                    />
                    <span>Are you shure to delete this article?</span>
                  </div>
                  <div className={classes['delete__change-buttons']}>
                    <button
                      type="button"
                      className={`${classes.delete__button} ${classes['delete__button-no']}`}
                      onClick={() => setDeletePopupOpen(false)}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      className={`${classes.delete__button} ${classes['delete__button-yes']}`}
                      onClick={() => {
                        dispatch(fetchDeleteArticle({ token, slug: article.slug }));
                      }}
                    >
                      Yes
                    </button>
                  </div>
                </div>
              }
            >
              <button
                type="button"
                className={`${classes['article__change-button']} ${classes['article__change-button--delete']}`}
              >
                Delete
              </button>
            </Popover>
            <Link to={`/articles/${article.slug}/edit`}>
              <button
                type="button"
                className={`${classes['article__change-button']} ${classes['article__change-button--edit']}`}
              >
                Edit
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
