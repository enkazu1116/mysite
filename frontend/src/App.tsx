import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import { RouterProvider } from "@heroui/react";
import Header from "./components/header";
import { SiteChrome } from "./components/SiteChrome.tsx";
import { ErrorState, LoadingState } from "./components/status";

const Home = lazy(() => import("./features/Home/home"));
const Skills = lazy(() => import("./features/Skills/skills"));
const Projects = lazy(() => import("./features/Projects/projects"));
const Users = lazy(() => import("./features/Users/users"));
const Books = lazy(() => import("./features/Books/books"));
const BookDetail = lazy(() => import("./features/Books/BookDetail"));
const UserBooksManagerPage = lazy(
  () => import("./features/Books/pages/UserBooksManagerPage"),
);
const BookMemosPage = lazy(() =>
  import("./features/Books/pages/BookMemosPage").then((module) => ({
    default: module.BookMemosPage,
  })),
);
const BookOutputsPage = lazy(() =>
  import("./features/Books/pages/BookOutputsPage").then((module) => ({
    default: module.BookOutputsPage,
  })),
);
const UserBookMemosPage = lazy(() =>
  import("./features/Books/pages/UserBookMemosPage").then((module) => ({
    default: module.UserBookMemosPage,
  })),
);
const UserBookOutputsPage = lazy(() =>
  import("./features/Books/pages/UserBookOutputsPage").then((module) => ({
    default: module.UserBookOutputsPage,
  })),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
    },
  },
});

function AppRoutes() {
  const navigate = useNavigate();

  return (
    <RouterProvider navigate={navigate}>
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
              <Route path="/users" element={<Users />} />
              <Route
                path="/users/:userId/books"
                element={<UserBooksManagerPage />}
              />
              <Route
                path="/users/:userId/books/:userBookId/memos"
                element={<UserBookMemosPage />}
              />
              <Route
                path="/users/:userId/books/:userBookId/outputs"
                element={<UserBookOutputsPage />}
              />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:userBookId" element={<BookDetail />} />
              <Route path="/books/:userBookId/memos" element={<BookMemosPage />} />
              <Route
                path="/books/:userBookId/outputs"
                element={<BookOutputsPage />}
              />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </SiteChrome>
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
