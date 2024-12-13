import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { Landing } from './components/Landing';
import { SignIn } from './components/Auth/SignIn';
import { SignUp } from './components/Auth/SignUp';
import { ChatLayout } from './components/Chat/ChatLayout';
import { NotesLayout } from './components/Notes/NotesLayout';
import { PatientTable } from './components/Patients/PatientTable';
import { PrivateRoute } from './components/Auth/PrivateRoute';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/chat/*"
              element={
                <PrivateRoute>
                  <ChatLayout />
                </PrivateRoute>
              }
            />
            <Route
              path="/notes"
              element={
                <PrivateRoute>
                  <NotesLayout />
                </PrivateRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <PrivateRoute>
                  <PatientTable />
                </PrivateRoute>
              }
            />
          </Routes>
        </MainLayout>
      </Router>
    </LanguageProvider>
  );
}

export default App;