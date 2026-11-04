import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import Header from "./components/header";
import { SiteChrome } from "./components/SiteChrome.tsx";
import { ErrorState, LoadingState } from "./components/status";
import AdminPage, { AdminGate } from "./features/Auth/AdminPage";

const Home = lazy(() => import("./features/Home/home"));
const Skills = lazy(() => import("./features/Skills/skills"));
const Projects = lazy(() => import("./features/Projects/projects"));
const ProjectDetail = lazy(() => import("./features/Projects/ProjectDetail"));
const UserProjectsManagerPage = lazy(
  () => import("./features/Projects/pages/UserProjectsManagerPage"),
);
const Users = lazy(() => import("./features/Users/users"));
const Books = lazy(() => import("./features/Books/books"));
const BookDetail = lazy(() => import("./features/Books/BookDetail"));
const UserBooksManagerPage = lazy(
  () => import("./features/Books/pages/UserBooksManagerPage"),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
    },
  },
});

function AppRoutes() {
  const location = useLocation();
  if (location.pathname === "/") {
    return <ErrorBoundary fallback={<ErrorState message="予期しないエラーが発生しました。" />}><Suspense fallback={<LoadingState />}><Routes><Route path="/" element={<Home />} /></Routes></Suspense></ErrorBoundary>;
  }
  return (
    <SiteChrome>
      <Header />
      <ErrorBoundary
        fallback={<ErrorState message="予期しないエラーが発生しました。" />}
      >
        <Suspense fallback={<LoadingState />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/users" element={<Users />} />
            <Route path="/admin" element={<AdminGate><AdminPage /></AdminGate>} />
            <Route
              path="/users/:userId/projects"
              element={<AdminGate><UserProjectsManagerPage /></AdminGate>}
            />
            <Route
              path="/users/:userId/books"
              element={<AdminGate><UserBooksManagerPage /></AdminGate>}
            />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:userBookId" element={<BookDetail />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </SiteChrome>
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
