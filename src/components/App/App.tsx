import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import AppHeader from '../AppHeader';
import ArticlesList from '../ArticlesList';
import Article from '../Article';
import ArticleForm from '../ArticleForm';
import SignUp from '../SignUp';
import SignIn from '../SignIn';
import EditProfile from '../EditProfile';

import classes from './App.module.scss';

function App() {
  return (
    <Router>
      <div className={classes.app}>
        <AppHeader />
        <main className={classes.app__main}>
          <Switch>
            <Route
              path="/articles/:slug"
              exact
              render={({ match }) => {
                const { slug } = match.params;
                return <Article articleSlug={slug} />;
              }}
            />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/sign-in" component={SignIn} />
            <Route path="/profile" component={EditProfile} />
            <Route path="/new-article" component={ArticleForm} />
            <Route
              path="/articles/:slug/edit"
              render={({ match }) => {
                const { slug } = match.params;
                return <ArticleForm articleSlug={slug} />;
              }}
            />
            <Route path="/" component={ArticlesList} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
