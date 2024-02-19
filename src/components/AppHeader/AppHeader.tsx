import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks';
import ProfileAvatar from '../ProfileAvatar';
import { fetchUser, logOut } from '../../store/fetchSlice';

import classes from './AppHeader.module.scss';

export default function AppHeader() {
  const { currentUser } = useAppSelector((state) => state.fetchSlice.usersFetchData);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!currentUser && token) {
      dispatch(fetchUser(token));
    }
  }, []);

  function renderHeaderControls() {
    if (currentUser) {
      return (
        <div className={classes['app-header__controls']}>
          <Link to="/new-article">
            <button
              className={`${classes['app-header__control']} ${classes['app-header__control__new-article']} ${classes['app-header__control--green']}`}
              type="button"
            >
              Create Article
            </button>
          </Link>
          <Link className={classes['app-header__control__profile']} to="/profile">
            <h2 className={classes['app-header__control__username']}>{currentUser.username}</h2>
            <ProfileAvatar />
          </Link>
          <Link to="/">
            <button
              className={classes['app-header__control']}
              type="button"
              onClick={() => dispatch(logOut())}
            >
              Log Out
            </button>
          </Link>
        </div>
      );
    }
    return (
      <div className={classes['app-header__controls']}>
        <Link to="/sign-in">
          <button className={classes['app-header__control']} type="button">
            Sign In
          </button>
        </Link>
        <Link to="/sign-up">
          <button
            className={`${classes['app-header__control']} ${classes['app-header__control--green']}`}
            type="button"
          >
            Sign Up
          </button>
        </Link>
      </div>
    );
  }

  return (
    <header className={classes['app-header']}>
      <Link to="/" className={classes['app-header__logo']}>
        <h1 className={classes['app-header__logo__text']}>Realworld Blog</h1>
      </Link>
      {renderHeaderControls()}
    </header>
  );
}
