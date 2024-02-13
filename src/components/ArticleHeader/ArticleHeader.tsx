import classNames from 'classnames';
import uniqid from 'uniqid';

import Tag from '../Tag';
import { useAppSelector, useDetectOverflow } from '../../hooks';
import like from '../../assets/icons/like.svg';

import classes from './ArticleHeader.module.scss';

export default function ArticleHeader({
  articleIdx,
  standalone = true,
}: {
  articleIdx: number;
  standalone: boolean;
}) {
  const [isTitleOverflow, titleRef] = useDetectOverflow<HTMLHeadingElement>();
  const [isDescriptionOverflow, descriptionRef] = useDetectOverflow<HTMLHeadingElement>();

  const article = useAppSelector(
    (state) => state.fetchSlice.articlesFetchData.articles[articleIdx]
  );

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
    [classes['article__header--standalone']]: standalone,
  });

  const titleClasses = classNames({
    [classes['article__title-wrap']]: true,
    [classes['article__title-wrap__popup']]: isTitleOverflow,
  });

  const descriptionClasses = classNames({
    [classes['article__description-wrap']]: true,
    [classes['article__description-wrap__popup']]: isDescriptionOverflow,
  });

  const tagItems = article.tagList
    .filter((tag) => tag.match(/\S/))
    .map((tag) => (
      <li key={`${article.slug}-${tag}-${uniqid.time()}`}>
        <Tag tag={tag} />
      </li>
    ));

  return (
    <header className={headerClasses}>
      <div className={classes.article__header__top}>
        <div className={classes.article__info}>
          <div className={titleClasses} data-content={article.title}>
            <h2 ref={titleRef} className={classes.article__title}>
              {article.title}
            </h2>
            <div className={classes.like}>
              <img className={classes.like__icon} src={like} alt="Like icon" />
              <span className={classes.like__count}>{article.favoritesCount}</span>
            </div>
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
      {article.description.match(/\S/) ? (
        <div className={descriptionClasses}>
          <p
            ref={descriptionRef}
            className={classes.article__description}
            data-content={article.description}
          >
            {article.description}
          </p>
        </div>
      ) : null}
    </header>
  );
}
