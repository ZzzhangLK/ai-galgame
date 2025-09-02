import ReactDOM from 'react-dom/client';
import AppRouter from './routes';
import 'antd/dist/reset.css'; // 引入 Ant Design 的重置样式
import './styles/global.scss'; // 引入我们的全局 Sass 样式

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppRouter />
  // <React.StrictMode>
  //   <AppRouter />
  // </React.StrictMode>,
);