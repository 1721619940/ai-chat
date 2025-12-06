import { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Chat from "./pages/Chat.jsx";

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setPage("chat");
    }
  }, []);

  function handleAuthSuccess({ user, token }) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setPage("chat");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPage("login");
  }

  if (!user) {
    if (page === "login") {
      return (
        <Login
          onSuccess={handleAuthSuccess}
          goSignup={() => setPage("signup")}
        />
      );
    }
    return (
      <Signup onSuccess={handleAuthSuccess} goLogin={() => setPage("login")} />
    );
  }

  return <Chat user={user} onLogout={handleLogout} />;
}

export default App;
