import Home from "./components/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Routes as Switch, Route } from "react-router-dom";
import CourseDetail from "./components/CourseDetail";
import Courses from "./components/Courses";
import Instructors from "./components/Instructors";
import About from "./components/About";

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
      </Switch>
      <div className="">
        <Footer />
      </div>
    </>
  );
}

export default App;
