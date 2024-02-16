import { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { useAppDispatch /* , useAppSelector  */ } from '../../hooks';
import { fetchArticles } from '../../store/fetchSlice';
import AppHeader from '../AppHeader';
import ArticlesList from '../ArticlesList';
import Article from '../Article';
import ProfileCreation from '../ProfileCreation';

import classes from './App.module.scss';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchArticles(0));
  }, []);

  return (
    <Router>
      <div className={classes.app}>
        <AppHeader />
        <main className={classes.app__main}>
          <Switch>
            <Route
              path="/articles/:slug"
              render={({ match }) => {
                const { slug } = match.params;
                return <Article articleSlug={slug} />;
              }}
            />
            <Route path="/sign-up" component={ProfileCreation} />
            <Route path="/" component={ArticlesList} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
