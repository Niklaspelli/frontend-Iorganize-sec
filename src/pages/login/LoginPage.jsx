import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import ReCAPTCHA from "react-google-recaptcha";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null); // reCAPTCHA token state

  const navigate = useNavigate();
  /* localStorage.setItem('token', token);  */

  const onChange = (token) => {
    setCaptchaToken(token); // Capture the token from reCAPTCHA
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const requestBody = {
      email,
      password,
      recaptchaToken: captchaToken,
    };

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Login successful!");
        localStorage.setItem("token", data.token);
        navigate("/workspace");
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      setMessage("An error occurred during login");
    }
  };

  return (
    <div className={styles.loginpage}>
      <h2>Login</h2>
      <div className={styles.logincomponent}>
        <form className={styles.form} onSubmit={handleLogin}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <ReCAPTCHA
            sitekey="6LfRVngqAAAAAMk_kGrqL-7v53mBr8yff8EVJvsD" // Use your actual site key here
            onChange={onChange}
          />
          <button className={styles.button} type="submit">
            Login
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
