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

function App() {
  return (
    <>
      <div className="">
        <Header />
      </div>
      <Switch>
        <Route path="/" element={<Home />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
      </Switch>
      <div className="">
        <Footer />
      </div>
    </>
  );
}

export default App;
