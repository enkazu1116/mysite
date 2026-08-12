import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router';
import Header from './components/header';
import Content from './components/content';
import Skills from './features/Skills/skills';
import Projects from './features/Projects/projects';
import Books from './features/Books/books';
import BookDetail from './features/Books/BookDetail';
import { BookMemosPage } from './features/Books/pages/BookMemosPage';
import { BookOutputsPage } from './features/Books/pages/BookOutputsPage';
import { UserBookMemosPage } from './features/Books/pages/UserBookMemosPage';
import { UserBookOutputsPage } from './features/Books/pages/UserBookOutputsPage';
import Users from './features/Users/users';
import UserBooksManagerPage from './features/Books/pages/UserBooksManagerPage';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { RouterProvider } from '@heroui/react';
import { ErrorState, LoadingState } from './components/status';

const queryClient = new QueryClient();

function AppRoutes() {
    const navigate = useNavigate();

    return (
        <RouterProvider navigate={navigate}>
            <Header />

            <ErrorBoundary fallback={<ErrorState message="予期しないエラーが発生しました。" />}>
                <Suspense fallback={<LoadingState />}>
                    <Routes>
                        <Route path="/" element={<Content />} />
                        <Route path="/skills" element={<Skills />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/users/:userId/books" element={<UserBooksManagerPage />} />
                        <Route path="/users/:userId/books/:userBookId/memos" element={<UserBookMemosPage />} />
                        <Route path="/users/:userId/books/:userBookId/outputs" element={<UserBookOutputsPage />} />
                        <Route path="/books" element={<Books />} />
                        <Route path="/books/:userBookId" element={<BookDetail />} />
                        <Route path="/books/:userBookId/memos" element={<BookMemosPage />} />
                        <Route path="/books/:userBookId/outputs" element={<BookOutputsPage />} />
                    </Routes>
                </Suspense>
            </ErrorBoundary>
        </RouterProvider>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
