import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then((res) => setSession(res.data.session)).catch(() => {});
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    setSession(data.session);
  };

  if (!session) {
    return (
      <div style={{ maxWidth: 420, margin: "80px auto", padding: 20 }}>
        <h2>Connexion</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, margin: "10px 0" }}
        />
        <input
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, margin: "10px 0" }}
        />
        <button onClick={signIn} style={{ padding: 10, width: "100%" }}>
          Se connecter
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
