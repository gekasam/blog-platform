import { useEffect } from 'react';
import { Pagination, ConfigProvider, Spin } from 'antd';
import classNames from 'classnames';

import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchArticles, clearCurrentArticle, clearDeleteState } from '../../store/fetchSlice';
import ArticleHeader from '../ArticleHeader';

import classes from './ArticlesList.module.scss';

export default function ArticlesList() {
  const token = localStorage.getItem('token');
  const dispatch = useAppDispatch();
  const {
    articlesFetchData: { articles, articlesCount },
    loading,
    usersFetchData: { currentUser },
  } = useAppSelector((state) => state.fetchSlice);

  useEffect(() => {
    dispatch(clearDeleteState());
    dispatch(clearCurrentArticle());
    if (token) {
      dispatch(fetchArticles({ offset: 0, token }));
    } else {
      dispatch(fetchArticles({ offset: 0, token: null }));
    }
  }, [currentUser]);

  const articleItems = articles.map((article) => (
    <li className={classes['articles-list__item']} key={article.slug}>
      <ArticleHeader isStandalone article={article} />
    </li>
  ));

  const paginationClasses = classNames(classes['article-list__pagination'], {
    [classes['article-list__pagination--hidden']]: loading,
  });

  return (
    <>
      {loading ? (
        <Spin className={classes['articles-list__spin']} />
      ) : (
        <ul className={classes['articles-list']}>{articleItems}</ul>
      )}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#fff',
          },
          components: {
            Pagination: {
              itemActiveBg: '#1890FF',
            },
          },
        }}
      >
        <Pagination
          className={paginationClasses}
          showSizeChanger={false}
          defaultCurrent={1}
          onChange={(value) => {
            if (token) {
              dispatch(fetchArticles({ offset: 5 * (value - 1), token }));
            } else {
              dispatch(fetchArticles({ offset: 5 * (value - 1), token: null }));
            }
          }}
          total={articlesCount}
        />
      </ConfigProvider>
    </>
  );
}
