import classes from './AppHeader.module.scss';

export default function AppHeader() {
  return (
    <header className={classes.app__header}>
      <a href="/" className={classes.app__header__logo}>
        <h1 className={classes.app__header__logo__text}>Realworld Blog</h1>
      </a>
      <div className={classes.app__header__controls}>
        <button className={classes.app__header__control} type="button">
          Sign In
        </button>
        <button
          className={`${classes.app__header__control} ${classes['app__header__control--green']}`}
          type="button"
        >
          Sign Up
        </button>
      </div>
    </header>
  );
}
