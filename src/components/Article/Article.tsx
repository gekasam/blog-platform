import { useEffect } from 'react';
import Markdown from 'marked-react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import ArticleHeader from '../ArticleHeader';
import { fetchArticle } from '../../store/fetchSlice';

import classes from './Article.module.scss';

export default function Article({ articleSlug }: { articleSlug: string }) {
  const { loading, currentArticle } = useAppSelector((state) => state.fetchSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchArticle(articleSlug));
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

  return <div className={classes['article-wrap']}>{!loading && renderArticle()}</div>;
}
