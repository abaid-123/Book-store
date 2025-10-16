import React, { useContext, useState } from "react";
import { Label, TextInput } from "flowbite-react";
import { AuthContext } from "../contects/AuthProvider"; // Fixed the import path
import { Link, useLocation, useNavigate } from "react-router-dom";
import googleimage from "../assets/google-logo.svg";

const Login = () => {
  const { login, loginwithGoogle } = useContext(AuthContext);
  const [error, setError] = useState(""); // Fixed the state setter name

  const location = useLocation();
  const navigate = useNavigate();

  // Set 'from' to the previous location or default to "/"
  const from = location.state?.from?.pathname || "/";

  // Handle form submission
  const handleLogin = (event) => {
    event.preventDefault(); // Prevent page reload
    const form = event.target;
    const email = form.email.value; // Access email from form
    const password = form.password.value; // Access password from form

    // Corrected login call (email and password should be separate)
    login(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert("Login Successful!");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Error (${errorCode}): ${errorMessage}`); // Debugging log
        setError(errorMessage); // Display error message
      });
  };

  const handleregister = () => {
    loginwithGoogle()
      .then((result) => {
        const user = result.user;
        alert("Login successfully with Google!");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log("Google Sign-in Error:", errorMessage); // Debugging log
        setError(errorMessage); // Display error message
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-lg max-w-lg w-full border border-gray-200">
        <h2 className="font-bold text-3xl mb-8 text-center">Sign in</h2>

        {/* Display error message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Sign Up form */}
        <form className="flex flex-col gap-6" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <div className="mb-1 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <TextInput
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <div className="mb-1 block">
              <Label htmlFor="password" value="Password" />
            </div>
            <TextInput
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            className="mt-5 bg-teal-500 py-2 text-white rounded"
            type="submit"
          >
            Login
          </button>
        </form>

        {/* Login prompt */}
        <p className="my-4 text-center">
          If you haven't an account, please{" "}
          <Link to="/sign-up" className="text-teal-500 underline">
            Sign up
          </Link>{" "}
          here.
        </p>
        <hr />
        <div className="flex w-full flex-col items-center gap-3 mt-5">
          <button onClick={handleregister} className="block">
            <img className="w-12 h-12 inline-block" src={googleimage} alt="" />
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
