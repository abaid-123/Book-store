import React, { useContext, useState } from "react";
import { Label, TextInput } from "flowbite-react";
import { AuthContext } from "../contects/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const { createUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const email = event.target.email.value.trim().toLowerCase();
    const password = event.target.password.value;

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setBusy(true);
    try {
      await createUser(email, password);
      navigate("/login", {
        replace: true,
        state: {
          email,
          info: "Account created. Please sign in with your email and password.",
        },
      });
    } catch (err) {
      setError(err.message || "Sign up failed.");
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
            Create account
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Create an account, then sign in with your email and password.
          </p>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>
              <div className="mb-1 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                id="email"
                name="email"
                type="email"
                placeholder="you@email.com"
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
                placeholder="At least 6 characters"
                required
              />
            </div>
            <button
              className="mt-2 bg-blue-700 py-3 text-white font-semibold rounded-lg hover:bg-black disabled:bg-gray-400"
              type="submit"
              disabled={busy}
            >
              {busy ? "Please wait..." : "Sign up"}
            </button>
          </form>

          <p className="my-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-700 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
