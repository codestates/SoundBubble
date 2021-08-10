import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Landing from "./Pages/Landing";
import MainPage from "./Pages/MainPage";
import Palette from "./Pages/Palette";
import BubbleDetail from "./Pages/BubbleDetail";
import Mypage from "./Pages/Mypage";
import LoginModal from "./Pages/LoginModal";
import SignupModal from "./Pages/SignupModal";
import error404 from "./Pages/error404";
import Test from "./Pages/Test";
import Navigation from "./Components/Navigation";

function App() {
  return (
    <>
      <Router>
        <Navigation />
        <Switch>
          <Route path="/landing" component={Landing} />
          <Route path="/MainPage" component={MainPage} />
          <Route path="/Palette" component={Palette} />
          <Route path="/BubbleDetail" component={BubbleDetail} />
          <Route path="/Mypage" component={Mypage} />
          <Route path="/LoginModal" component={LoginModal} />
          <Route path="/SignupModal" component={SignupModal} />
          <Route path="/test" component={Test} />
          <Route path="*" component={error404} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
