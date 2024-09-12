import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import EnhancedDietTracker from './pages/DietTracker';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <div className='m-3'>
            <EnhancedDietTracker />
          </div>
          <Toaster />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
