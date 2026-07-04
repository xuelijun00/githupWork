import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { BatchDetail } from './pages/BatchDetail';
import { Records } from './pages/Records';
import { Abnormal } from './pages/Abnormal';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/batch/:id" element={<BatchDetail />} />
            <Route path="/records" element={<Records />} />
            <Route path="/abnormal" element={<Abnormal />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
