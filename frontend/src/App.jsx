import { useState } from 'react';
import { Landing } from './components/Landing';
import { Login } from './components/Login';
import { CitizenDashboard } from './components/CitizenDashboard';
import { ReportIssue } from './components/ReportIssue';
import { MapView } from './components/MapView';
import { IssueDetail } from './components/IssueDetail';
import { AuthorityDashboard } from './components/AuthorityDashboard';
import { ComplaintManagement } from './components/ComplaintManagement';
import { Analytics } from './components/Analytics';
import { DarkModeProvider } from './contexts/DarkModeContext';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [userRole, setUserRole] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const navigate = (screen) => {
    setCurrentScreen(screen);
  };

  const handleLogin = (role) => {
    setUserRole(role);
    if (role === 'citizen') {
      navigate('citizen-dashboard');
    } else if (role === 'authority') {
      navigate('authority-dashboard');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    navigate('landing');
  };

  const viewIssueDetail = (issue) => {
    setSelectedIssue(issue);
    navigate('issue-detail');
  };

  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
        {currentScreen === 'landing' && (
          <Landing onNavigate={navigate} />
        )}

        {(currentScreen === 'login' || currentScreen === 'signup') && (
          <Login
            isSignup={currentScreen === 'signup'}
            onLogin={handleLogin}
            onNavigate={navigate}
          />
        )}

        {currentScreen === 'citizen-dashboard' && (
          <CitizenDashboard
            onNavigate={navigate}
            onLogout={handleLogout}
            onViewIssue={viewIssueDetail}
          />
        )}

        {currentScreen === 'report-issue' && (
          <ReportIssue
            onNavigate={navigate}
            onBack={() => navigate('citizen-dashboard')}
          />
        )}

        {currentScreen === 'map-view' && (
          <MapView
            onNavigate={navigate}
            onViewIssue={viewIssueDetail}
            userRole={userRole}
            onLogout={handleLogout}
          />
        )}

        {currentScreen === 'issue-detail' && selectedIssue && (
          <IssueDetail
            issue={selectedIssue}
            onNavigate={navigate}
            onBack={() =>
              navigate(
                userRole === 'authority'
                  ? 'authority-dashboard'
                  : 'citizen-dashboard'
              )
            }
            userRole={userRole}
          />
        )}

        {currentScreen === 'authority-dashboard' && (
          <AuthorityDashboard
            onNavigate={navigate}
            onLogout={handleLogout}
            onViewIssue={viewIssueDetail}
          />
        )}

        {currentScreen === 'complaint-management' && (
          <ComplaintManagement
            onNavigate={navigate}
            onViewIssue={viewIssueDetail}
          />
        )}

        {currentScreen === 'analytics' && (
          <Analytics onNavigate={navigate} />
        )}
      </div>
    </DarkModeProvider>
  );
}
