import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../features/auth/AuthContext';
import ProtectedRoute from '../features/auth/ProtectedRoute';
import LoginPage from '../features/auth/LoginPage';
import Layout from './Layout';
import { DataProvider } from './DataProvider';
import ResourceList from '../features/resources/ResourceList';
import ResourceDetail from '../features/resources/ResourceDetail';
import GuestList from '../features/guests/GuestList';
import GuestDetail from '../features/guests/GuestDetail';
import DocumentList from '../features/documents/DocumentList';
import DocumentDetail from '../features/documents/DocumentDetail';
import NotesPage from '../features/notes/NotesPage';
import TranslationDashboard from '../features/translation/TranslationDashboard';
import SearchResults from '../features/search/SearchResults';
import { PublicDataProvider } from '../features/public/PublicDataProvider';
import PublicLayout from '../features/public/PublicLayout';
import PublicHome from '../features/public/PublicHome';
import PublicResourceDetail from '../features/public/PublicResourceDetail';
import PublicDocumentDetail from '../features/public/PublicDocumentDetail';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/public"
            element={
              <PublicDataProvider>
                <PublicLayout />
              </PublicDataProvider>
            }
          >
            <Route index element={<PublicHome />} />
            <Route path="resources/:id" element={<PublicResourceDetail />} />
            <Route path="documents/:id" element={<PublicDocumentDetail />} />
          </Route>
          <Route
            element={
              <ProtectedRoute>
                <DataProvider>
                  <Layout />
                </DataProvider>
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<ResourceList />} />
            <Route path="/resources/:id" element={<ResourceDetail />} />
            <Route path="/guests" element={<GuestList />} />
            <Route path="/guests/:id" element={<GuestDetail />} />
            <Route path="/documents" element={<DocumentList />} />
            <Route path="/documents/:id" element={<DocumentDetail />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/translation" element={<TranslationDashboard />} />
            <Route path="/search" element={<SearchResults />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
