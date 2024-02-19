import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import AppHeader from '../AppHeader';
import ArticlesList from '../ArticlesList';
import Article from '../Article';
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
              render={({ match }) => {
                const { slug } = match.params;
                return <Article articleSlug={slug} />;
              }}
            />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/sign-in" component={SignIn} />
            <Route path="/profile" component={EditProfile} />
            <Route path="/" component={ArticlesList} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
