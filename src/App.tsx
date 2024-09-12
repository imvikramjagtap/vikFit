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
          <div className='m-3 flex flex-col items-center'>
            <EnhancedDietTracker />
            <div className='flex w-4xl items-center justify-center my-2 py-1'>©️Vikram Jagtap 2024</div>
          </div>
          <Toaster />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
