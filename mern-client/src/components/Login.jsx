import React, { useContext, useEffect, useState } from "react";
import { Label, TextInput } from "flowbite-react";
import { AuthContext } from "../contects/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const presetEmail = location.state?.email || "";

  useEffect(() => {
    if (location.state?.info) {
      setInfo(location.state.info);
    }
  }, [location.state]);

  const goByRole = (userRole) => {
    if (userRole === "admin") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }
    const next = from.startsWith("/admin") ? "/" : from || "/";
    navigate(next === "/login" ? "/" : next, { replace: true });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    const email = event.target.email.value.trim().toLowerCase();
    const password = event.target.password.value;
    setBusy(true);
    try {
      const profile = await login(email, password);
      goByRole(profile.role);
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-teal-100 min-h-screen">
      <div className="px-4 lg:px-24 pt-32 pb-16 flex justify-center">
        <div className="bg-white p-8 sm:p-10 rounded-2xl max-w-lg w-full border border-slate-200 shadow-sm">
          <p className="uppercase tracking-widest text-blue-700 font-semibold text-center mb-2">
            Book Store
          </p>
          <h2 className="font-bold text-3xl sm:text-4xl mb-3 text-center text-black">
            Sign in
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Enter your email and password to continue.
          </p>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {info && <p className="text-green-700 text-center mb-4">{info}</p>}

          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            <div>
              <div className="mb-1 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                id="email"
                name="email"
                type="email"
                placeholder="you@email.com"
                defaultValue={presetEmail}
                required
              />
            </div>
            <div>
              <div className="mb-1 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <TextInput
                id="password"
                name="password"
                type="password"
                placeholder="Your password"
                required
              />
            </div>
            <button
              className="mt-2 bg-blue-700 py-3 text-white font-semibold rounded-lg hover:bg-black disabled:bg-gray-400"
              type="submit"
              disabled={busy}
            >
              {busy ? "Please wait..." : "Login"}
            </button>
          </form>

          <p className="my-4 text-center text-gray-600">
            Don’t have an account?{" "}
            <Link to="/sign-up" className="text-blue-700 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
