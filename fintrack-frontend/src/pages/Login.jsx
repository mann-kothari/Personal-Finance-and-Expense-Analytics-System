import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      alert("Please enter email and password.");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    alert("Login form submitted successfully.");
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <br />

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <br />

        <div>
          <label htmlFor="password">Password</label>
          <br />

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <br />

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;