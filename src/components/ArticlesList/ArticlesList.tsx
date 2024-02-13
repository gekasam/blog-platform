import { Pagination } from 'antd';

import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchArticles } from '../../store/fetchSlice';
import ArticleHeader from '../ArticleHeader';

import classes from './ArticlesList.module.scss';

export default function ArticlesList() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useAppDispatch();
  const storeFetch = useAppSelector((state) => state.fetchSlice);
  const articleItems = storeFetch.articlesFetchData.articles.map((article, index) => (
    <li className={classes['articles-list__item']} key={article.slug}>
      <ArticleHeader standalone={false} articleIdx={index} />
    </li>
  ));

  return (
    <>
      <ul className={classes['articles-list']}>{articleItems}</ul>
      <Pagination
        showSizeChanger={false}
        defaultCurrent={1}
        onChange={(value) => dispatch(fetchArticles(5 * (value - 1)))}
        /*  defaultPageSize={5} */ total={storeFetch.articlesFetchData.articlesCount}
      />
    </>
  );
}
