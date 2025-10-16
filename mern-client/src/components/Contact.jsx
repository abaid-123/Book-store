import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="mt-28 px-4 lg:px-24">
      <h2 className="text-5xl font-bold text-center">Contact Us</h2>
      {/* Wrapper for the form with border */}
      <div className="mt-8 max-w-lg mx-auto  my-5 border-blue-400 rounded-lg p-6 shadow-2xl">
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="form-group mb-4">
            <label htmlFor="name" className="block text-lg font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-2 p-2 border border-gray-300 rounded w-full focus:border-blue-500 focus:outline-none transition duration-300"
            />
          </div>

          {/* Email Field */}
          <div className="form-group mb-4">
            <label htmlFor="email" className="block text-lg font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2 p-2 border border-gray-300 rounded w-full focus:border-blue-500 focus:outline-none transition duration-300"
            />
          </div>

          {/* Message Field */}
          <div className="form-group mb-4">
            <label htmlFor="message" className="block text-lg font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="mt-2 p-2 border border-gray-300 rounded w-full h-32 focus:border-blue-500 focus:outline-none transition duration-300"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-6 bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300 hover:bg-blue-800"
          >
            Send Message
          </button>
        </form>

        {/* Contact Information */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold">Get in Touch</h3>
          <p className="mt-2">You can also reach us at:</p>
          <p>Email: info@yourbookstore.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
