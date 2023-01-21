import GitHubIcon from "@mui/icons-material/GitHub";
import "./Login.css";

const Login = () => {
  return (
    <div>
      <section className="quiz quiz-small">
        <form className="setup-form">
          <h2>Login</h2>

          <a
            href={`${process.env.REACT_APP_BACKEND}login/github?frontend_redirect_callback="${process.env.REACT_APP_FRONTEND_REDIRECT_CALLBACK}`}
          >
            <button type="button" className="submit-btn">
              <GitHubIcon fontSize="large" />
            </button>
          </a>
        </form>
      </section>
    </div>
  );
};

export default Login;
