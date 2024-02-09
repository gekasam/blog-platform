import { fetchArticles } from '../../store/fetchSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

import classes from './Header.module.scss';

export default function Header() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const storeFetch = useAppSelector((state) => state.fetchSlice);
  const dispatch = useAppDispatch();

  return (
    <header className={classes['page-header']}>
      <a href="/" className={classes['page-header__logo']}>
        <h2>Realworld Blog</h2>
      </a>
      <div className={classes['page-header__controls']}>
        <button
          className={classes['page-header__control']}
          type="button"
          onClick={() => dispatch(fetchArticles())}
        >
          Sign In
        </button>
        <button
          className={`${classes['page-header__control']} ${classes['page-header__control--green']}`}
          type="button"
        >
          Sign Up
        </button>
      </div>
    </header>
  );
}
