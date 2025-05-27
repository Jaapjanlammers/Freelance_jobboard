import { useState } from "react";
import { supabase } from "../../SupabaseClient";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setMessage(error ? error.message : "Logged in!");
    } else if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      setMessage(error ? error.message : "Check your email to confirm your account!");
    } else if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      setMessage(error ? error.message : "Password reset email sent!");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: 24,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px #0001",
      }}
    >
      <h2 style={{ marginBottom: 16 }}>
        {mode === "login" && "Login"}
        {mode === "signup" && "Sign Up"}
        {mode === "forgot" && "Forgot Password"}
      </h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        required
        onChange={e => setEmail(e.target.value)}
        style={{
          width: "100%",
          marginBottom: 12,
          padding: 8,
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />
      {mode !== "forgot" && (
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 12,
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
      )}
      <button
        type="submit"
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 6,
          background: "#4f46e5",
          color: "#fff",
          fontWeight: "bold",
          border: "none",
          marginBottom: 8,
        }}
      >
        {mode === "login" && "Login"}
        {mode === "signup" && "Sign Up"}
        {mode === "forgot" && "Send Reset Email"}
      </button>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
        {mode !== "login" && (
          <span
            style={{ color: "#4f46e5", cursor: "pointer" }}
            onClick={() => setMode("login")}
          >
            Login
          </span>
        )}
        {mode !== "signup" && (
          <span
            style={{ color: "#4f46e5", cursor: "pointer" }}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </span>
        )}
        {mode !== "forgot" && (
          <span
            style={{ color: "#4f46e5", cursor: "pointer" }}
            onClick={() => setMode("forgot")}
          >
            Forgot?
          </span>
        )}
      </div>
      {message && (
        <div style={{ marginTop: 12, color: message.includes("error") ? "red" : "green" }}>
          {message}
        </div>
      )}
    </form>
  );
}