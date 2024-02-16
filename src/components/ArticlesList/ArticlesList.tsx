import { Pagination, ConfigProvider } from 'antd';

import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchArticles } from '../../store/fetchSlice';
import ArticleHeader from '../ArticleHeader';

import classes from './ArticlesList.module.scss';

export default function ArticlesList() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useAppDispatch();
  const storeFetch = useAppSelector((state) => state.fetchSlice);

  const articleItems = storeFetch.articlesFetchData.articles.map((article) => (
    <li className={classes['articles-list__item']} key={article.slug}>
      <ArticleHeader isStandalone article={article} />
    </li>
  ));

  return (
    <>
      <ul className={classes['articles-list']}>{articleItems}</ul>
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
          total={storeFetch.articlesFetchData.articlesCount}
        />
      </ConfigProvider>
    </>
  );
}
