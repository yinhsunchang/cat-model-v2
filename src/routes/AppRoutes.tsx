import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "./ScrollToTop.ts";
import LayoutMain from "../layouts/LayoutMain.tsx";
import PageAbout from "../pages/about/PageAbout.tsx";
import PagePortfolio from "../pages/portfolio/PagePortfolio.tsx";
import PageBox from "../pages/box/PageBox.tsx";
import Encyclopedia from "../pages/box/Encyclopedia.tsx";
import Films from "../pages/box/Films.tsx";
import PageContact from "../pages/contact/PageContact.tsx";
import PageSignup from "../pages/signup/PageSignup.tsx";
import PageSignin from "../pages/signin/PageSignin.tsx";
import GuestRoute from "./GuestRoute.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import LayoutAdmin from "../layouts/LayoutAdmin.tsx";
import PageDashboard from "../pages/dashboard/PageDashboard.tsx";
import PageSubscribers from "../pages/subscribers/PageSubscribers.tsx";
import PageMessages from "../pages/messages/PageMessages.tsx";
import PageReservations from "../pages/reservations/PageReservations.tsx";
import PageTodos from "../pages/todos/PageTodos.tsx";
import Page404 from "../pages/404/Page404.tsx";

const AppRoutes = () => {
  return (
    <>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <Routes>
          <Route element={<LayoutMain />}>
            <Route path="/" element={<PageAbout />} />
            <Route path="/portfolio" element={<PagePortfolio />} />
            <Route path="/box" element={<PageBox />}>
              <Route index element={<Navigate to="encyclopedia" replace />} />
              <Route path="encyclopedia" element={<Encyclopedia />} />
              <Route path="films" element={<Films />} />
            </Route>
            <Route path="/contact" element={<PageContact />} />
          </Route>

          <Route
            path="/signup"
            element={
              <GuestRoute>
                <PageSignup />
              </GuestRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <GuestRoute>
                <PageSignin />
              </GuestRoute>
            }
          />

          <Route element={<LayoutAdmin />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PageDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscribers"
              element={
                <ProtectedRoute>
                  <PageSubscribers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <PageMessages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservations"
              element={
                <ProtectedRoute>
                  <PageReservations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/todos"
              element={
                <ProtectedRoute>
                  <PageTodos />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRoutes;
