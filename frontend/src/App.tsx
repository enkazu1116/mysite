import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router';
import Header from './components/header';
import Content from './components/content';
import Skills from './features/Skills/skills';
import Projects from './features/Projects/projects';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Header />
                
                <ErrorBoundary fallback={<p>Error</p>}>
                    <Suspense fallback={<p>Loading...</p>}>
                        <Routes>
                            <Route path="/" element={<Content />} />
                            <Route path="/skills" element={<Skills />} />
                            <Route path="/projects" element={<Projects />} />
                        </Routes>        
                    </Suspense>
                </ErrorBoundary>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;