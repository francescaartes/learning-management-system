import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Routes as Switch, Route } from "react-router-dom";
import CourseDetail from "./pages/CourseDetail";
import Courses from "./pages/Courses";
import Instructors from "./pages/Instructors";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { UserProvider } from "./contexts/UserContext";
import PrivateRoute from "./route/PrivateRoute";
import PublicRoute from "./route/PublicRoute";

function App() {
  return (
    <>
      <UserProvider>
        <div className="">
          <Header />
        </div>
        <Switch>
          <Route path="/" element={<Home />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/sign-up"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Switch>
        <div className="">
          <Footer />
        </div>
      </UserProvider>
    </>
  );
}

export default App;
