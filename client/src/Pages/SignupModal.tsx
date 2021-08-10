import "./Styles/SignupModal.css";

const SignupModal = () => {
  return (
    <div className="body">
      <aside className="signup-sidebar-content">
        <header className="signup-header"></header>
        <img />
      </aside>
      <main className="signup-main">
        <div className="signup-content">
          <h2>Sign up to soundBubble</h2>
          <div className="social-login-group"></div>
          <hr className="divider" />
          <fieldset className="user-name">
            <label className="signup-label">Name</label>
            <input className="input-name" type="text" />
          </fieldset>
          <fieldset className="user-email">
            <label className="signup-label">Email</label>
            <input className="input-email" type="email" />
          </fieldset>
          <div className="password-group">
            <fieldset className="user-password">
              <label className="signup-label">Password</label>
              <input className="input-password" type="password" />
            </fieldset>
            <fieldset className="user-RePassword">
              <label className="signup-label">Re-Password</label>
              <input className="input-RePassword" type="password" />
            </fieldset>
          </div>
          <div className="form-btn">
            <button>Create Account</button>
            <button>Go To Login</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupModal;
