import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../SupabaseClient";

export default function AuthCallback() {
  const router = useRouter();
  const [message, setMessage] = useState("Processing...");
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    // Supabase will handle the token in the URL automatically
    const hash = typeof window !== "undefined" ? window.location.hash : "";

    if (hash.includes("type=recovery")) {
      setMessage("Please set your new password.");
      // Optionally, show a password reset form here
    } else if (hash.includes("type=signup")) {
      // Optionally, show a password reset form here
    } else if (hash.includes("type=signup")) {
      setMessage("Your email has been confirmed! You can now log in.");
      // Optionally, redirect to login after a delay
      setTimeout(() => router.push("/jobs"), 3000);
    } else {
      setMessage("Redirecting...");
      setTimeout(() => router.push("/jobs"), 2000);
    }
  }, [router]);
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Updating password...");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage("Error updating password: " + error.message);
    } else {
      setMessage("Password updated! Redirecting...");
      setTimeout(() => router.push("/jobs"), 2000);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "4rem auto", textAlign: "center" }}>
      <h2>{message}</h2>
      {showPasswordForm && (
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            style={{ margin: "1rem 0", padding: "0.5rem", width: "100%" }}
          />
          <button type="submit" style={{ padding: "0.5rem 1rem" }}>
            Set Password
          </button>
        </form>
      )}
    </div>
  );
}