import { useState } from 'react';
import { Backdrop } from '@/components/Backdrop';
import { NavBar } from '@/components/NavBar';
import { Dashboard } from '@/screens/Dashboard';
import { LabScreen } from '@/screens/LabScreen';
import { LearnScreen } from '@/screens/LearnScreen';
import { QuizScreen } from '@/screens/QuizScreen';
import { EmailSimulatorScreen } from '@/screens/EmailSimulatorScreen';
import { AskAIScreen } from '@/screens/AskAIScreen';
import type { Screen } from '@/types';

function App() {
  const [screen, setScreen] = useState<Screen>('dashboard');

  const handleNavigate = (s: Screen) => {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen">
      <Backdrop />
      <div className="relative z-10">
        <NavBar current={screen} onNavigate={handleNavigate} />
        <main>
          {screen === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
          {screen === 'lab' && <LabScreen />}
          {screen === 'learn' && <LearnScreen />}
          {screen === 'quiz' && <QuizScreen />}
          {screen === 'simulator' && <EmailSimulatorScreen />}
          {screen === 'askai' && <AskAIScreen />}
        </main>
      </div>
    </div>
  );
}

export default App;
