import logo from './logo.svg';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import Routers from './router';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      {/* 这里可以嵌套其他provider例如权限组件Permission,如果使用use-query也嵌套在此 */}
      <BrowserRouter>
        <Routers />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
