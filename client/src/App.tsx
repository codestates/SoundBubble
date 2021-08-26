import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Landing from "./Pages/Landing";
import MainPage from "./Pages/MainPage";
import Palette from "./Pages/Palette";
import BubbleDetail from "./Pages/BubbleDetail";
import Mypage from "./Pages/Mypage";
import LoginModal from "./Pages/LoginModal";
import SignupModal from "./Pages/SignupModal";
import error404 from "./Pages/error404";

function App(): JSX.Element {
	return (
		<>
			<Router>
				<Switch>
					<Route exact path="/" component={Landing} />
					<Route path="/main" component={MainPage} />
					<Route path="/palette" component={Palette} />
					<Route path="/bubble/:id" component={BubbleDetail} />
					<Route path="/mypage" component={Mypage} />
					<Route path="/login" component={LoginModal} />
					<Route path="/signup" component={SignupModal} />
					<Route path="*" component={error404} />
				</Switch>
			</Router>
		</>
	);
}

export default App;
