import { Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { useUserStore } from "./store";
import { verifyToken } from "./utils/auth";
import { consola } from "consola";

function App() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        consola.info("No token found, redirecting to login");
        navigate("/login");
        return;
      }

      const payload = await verifyToken(token);
      if (!payload) {
        consola.error("Invalid token, redirecting to login");
        localStorage.removeItem("auth_token");
        navigate("/login");
      } else {
        consola.success("User verified via jose");
        setUser(payload as any);
      }
    };

    checkAuth();
  }, [navigate, setUser]);

  return (
    <div className="w-full">
      <Outlet />
    </div>
  )
}

export default App
