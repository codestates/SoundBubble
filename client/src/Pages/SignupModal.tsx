import "./Styles/SignupModal.css";

const SignupModal = () => {
  return (
    <div className="signup-body">
      <aside className="signup-sidebar-content">
        <header className="signup-header"></header>
        <img />
      </aside>
      <main className="signup-main">
        <div className="signup-content">
          <h2>Sign up to soundBubble</h2>
          <hr className="divider" />
          <fieldset className="signup-user-name">
            <label className="signup-label">Name</label>
            <input className="signup-input-name" type="text" />
          </fieldset>
          <fieldset className="signup-user-email">
            <label className="signup-label">Email</label>
            <input className="signup-input-email" type="email" />
          </fieldset>
          <div className="signup-password-group">
            <fieldset className="signup-user-password">
              <label className="signup-label">Password</label>
              <input className="signup-input-password" type="password" />
            </fieldset>
            <fieldset className="signup-user-RePassword">
              <label className="signup-label">Re-Password</label>
              <input className="signup-input-RePassword" type="password" />
            </fieldset>
          </div>
          <div className="signup-form-btn">
            <button>Create Account</button>
            <button>Go To Login</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupModal;
