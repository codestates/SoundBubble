import React from "react";
import "./Styles/Navigation.css";

const Navigation = () => {
  const isLogin = false;
  return (
    <>
      <nav className="navigation">
        <div className="nav-container">
          <div className="left-nav-bar">
            <img className="nav-logo" src="" alt="logo" />
          </div>
          <ul className="right-nav-bar">
            <li>
              <a>mypage</a>
            </li>
            {isLogin ? (
              <li>
                <a className="nav-login-btn">Logout</a>
              </li>
            ) : (
              <li>
                <a className="nav-login-btn">Login</a>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
