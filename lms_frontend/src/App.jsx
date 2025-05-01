import Home from "./components/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Routes as Switch, Route } from "react-router-dom";

function App() {
  return (
    <>
      <div className="">
        <Header />
      </div>
      <Switch>
        <Route path="/" element={<Home />} />
      </Switch>
      <div className="">
        <Footer />
      </div>
    </>
  );
}

export default App;
