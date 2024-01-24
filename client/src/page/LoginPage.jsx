/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { IsLoginContext } from "../App";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

function LoginPage() {
  const { isLogin, setIsLogin } = useContext(IsLoginContext);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault(); // Correct the typo
    if (username === "admin" && password === "admin") {
      setIsLogin(true);
      navigate("/branch");
    } else {
      alert(
        "The provided credentials are incorrect; please verify that the username and password entered are accurate."
      );
    }
  };

  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      `}
    >
      <div
        css={css`
          background-color: lightblue;
          padding: 2rem;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 3rem;
        `}
      >
        <h1
          css={css`
            text-align: center;
            flex: 1;
          `}
        >
          Clinic Management Software
        </h1>

        <form
          onSubmit={handleLogin}
          css={css`
            display: flex;
            flex-direction: column;
            gap: 1rem;
            flex: 1;
          `}
        >
          <FloatingLabel
            controlId="floatingInput"
            label="Username"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="Password">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FloatingLabel>
          <Button type="submit">Login</Button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
