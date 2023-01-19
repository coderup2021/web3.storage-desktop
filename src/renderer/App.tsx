import {
  MemoryRouter as Router,
  Routes,
  Route,
  HashRouter,
} from 'react-router-dom';
import './App.scss';
import Layout from './Layout/Layout';
import { QueryClient, QueryClientProvider } from 'react-query';

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Layout />
      </HashRouter>
    </QueryClientProvider>
  );
}
