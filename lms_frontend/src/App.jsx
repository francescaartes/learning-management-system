import "./App.css";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Routes as Switch, Route } from "react-router-dom";
import CourseDetail from "./pages/CourseDetail";
import Courses from "./pages/Courses";
import Instructors from "./pages/Instructors";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { UserProvider } from "./contexts/UserContext";
import PrivateRoute from "./route/PrivateRoute";
import PublicRoute from "./route/PublicRoute";
import StartTeaching from "./pages/StartTeaching";
import CreateCourse from "./pages/CreateCourse";
import CoursePage from "./pages/CoursePage";

function App() {
  return (
    <>
      <UserProvider>
        <div className="sticky-top bg-white">
          <Header />
        </div>
        <Switch>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route
            path="/course/:courseId"
            element={
              <PrivateRoute>
                <CoursePage />
              </PrivateRoute>
            }
          />
          <Route path="/instructors" element={<Instructors />} />
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
          <Route path="/start_teaching" element={<StartTeaching />} />
          <Route
            path="/create_course"
            element={
              <PrivateRoute>
                <CreateCourse />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit_course/:courseId"
            element={
              <PrivateRoute>
                <CreateCourse />
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
