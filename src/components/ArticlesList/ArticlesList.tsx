import { useEffect } from 'react';
import { Pagination, ConfigProvider, Spin } from 'antd';

import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchArticles, clearCurrentArticle, clearDeleteState } from '../../store/fetchSlice';
import ArticleHeader from '../ArticleHeader';

import classes from './ArticlesList.module.scss';

export default function ArticlesList() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useAppDispatch();
  const {
    articlesFetchData: { articles, articlesCount },
    loading,
  } = useAppSelector((state) => state.fetchSlice);

  useEffect(() => {
    dispatch(clearDeleteState());
    dispatch(clearCurrentArticle());
    dispatch(fetchArticles(0));
  }, []);

  const articleItems = articles.map((article) => (
    <li className={classes['articles-list__item']} key={article.slug}>
      <ArticleHeader isStandalone article={article} />
    </li>
  ));

  return (
    <>
      {loading ? <Spin /> : <ul className={classes['articles-list']}>{articleItems}</ul>}
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
          className={classes['article-list__pagination']}
          showSizeChanger={false}
          defaultCurrent={1}
          onChange={(value) => dispatch(fetchArticles(5 * (value - 1)))}
          total={articlesCount}
        />
      </ConfigProvider>
    </>
  );
}
