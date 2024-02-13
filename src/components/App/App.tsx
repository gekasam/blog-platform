import { useEffect } from 'react';

import { useAppDispatch /* , useAppSelector  */ } from '../../hooks';
import { fetchArticles } from '../../store/fetchSlice';
import AppHeader from '../AppHeader';
import ArticlesList from '../ArticlesList';
import './App.module.scss';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchArticles(0));
  }, []);

  return (
    <div>
      <AppHeader />
      <main>
        <ArticlesList />
      </main>
    </div>
  );
}

export default App;
