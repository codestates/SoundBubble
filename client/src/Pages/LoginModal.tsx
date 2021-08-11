import "./Styles/LoginModal.css";

const LoginModal = () => {
  return (
    <div className="login-body">
      <aside className="login-sidebar-content">
        <header className="login-header"></header>
        <img />
      </aside>
      <main className="login-main">
        <div className="login-content">
          <h2>Login to soundBubble</h2>
          <div className="social-login-group">소셜 로그인 버튼</div>
          <hr className="divider" />
          <fieldset className="login-user-email">
            <label className="login-label">Email Address</label>
            <input className="login-input-email" type="email" />
          </fieldset>
          <fieldset className="login-user-password">
            <label className="login-label">Password</label>
            <input className="login-input-password" type="password" />
          </fieldset>
          <div className="login-form-btn">
            <button>Login</button>
            <button>Go To Sign-Up</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginModal;
