import React, { useContext, useState } from "react";
import { Label, TextInput } from "flowbite-react";
import { AuthContext } from "../contects/AuthProvider"; // Fixed the import path
import { Link, useLocation, useNavigate } from "react-router-dom";
import googleimage from "../assets/google-logo.svg";

const SignUp = () => {
  const { createUser, loginwithGoogle } = useContext(AuthContext);
  const [error, setError] = useState(""); // Fixed the state setter name

  const location = useLocation();
  const navigate = useNavigate();

  // Set 'from' to the previous location or default to "/"
  const from = location.state?.from?.pathname || "/";

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    const form = event.target;
    const email = form.email.value; // Access email from form
    const password = form.password.value; // Access password from form

    // Firebase create user method
    createUser(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed up successfully:", user); // Debug log
        alert("Sign up successful!");

        // Navigate to the 'from' path (home or previous location)
        navigate(from, { replace: true });
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log("Sign up error:", errorMessage); // Debug log
        setError(errorMessage);
      });
  };

  const handleregister = () => {
    loginwithGoogle().then((result) => {
      const user = result.user;
      alert("login succefully");
      navigate(from, { replace: true }).catch((error) => {
        const errorMessage = error.message;
        console.log("Sign up error:", errorMessage); // Debug log
        setError(errorMessage);
      });
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-lg max-w-lg w-full border border-gray-200">
        <h2 className="font-bold text-3xl mb-8 text-center">Sign Up</h2>

        {/* Display error message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Sign Up form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
            Sign Up
          </button>
        </form>

        {/* Login prompt */}
        <p className="my-4 text-center">
          If you have an account, please{" "}
          <Link to="/login" className="text-teal-500 underline">
            login 
          </Link>
          {" "}here.
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

export default SignUp;
