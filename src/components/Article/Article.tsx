import { useEffect } from 'react';
import { Spin } from 'antd';
import Markdown from 'marked-react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import ArticleHeader from '../ArticleHeader';
import { fetchArticle } from '../../store/fetchSlice';

import classes from './Article.module.scss';

export default function Article({ articleSlug }: { articleSlug: string }) {
  const token = localStorage.getItem('token');
  const { loading, currentArticle } = useAppSelector((state) => state.fetchSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
      dispatch(fetchArticle({ slug: articleSlug, token }));
    } else {
      dispatch(fetchArticle({ slug: articleSlug, token: null }));
    }
  }, [dispatch, articleSlug]);

  function renderArticle() {
    if (!currentArticle) {
      return <span>{`Current article is ${currentArticle}`}</span>;
    }
    return (
      <article className={classes.article}>
        <ArticleHeader isStandalone={false} article={currentArticle} />
        <main className={classes.article__content}>
          <Markdown breaks gfm value={currentArticle.body} />
        </main>
      </article>
    );
  }

  return loading ? <Spin /> : <div className={classes['article-wrap']}>{renderArticle()}</div>;
}
