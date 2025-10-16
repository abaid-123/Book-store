import React from "react";
import Navbar from "./Navbar"; // Assuming you already have the Navbar component
import "./About.css"; // Import custom CSS for styling

const About = () => {
  return (
    <div className="about-page">
      <Navbar />
      <section className="mt-20 px-4 lg:px-24">
        <div className="about-container">
          <h1 className="about-title">About Us</h1>
          <p className="about-text">
            Welcome to our Book Store, your number one source for all things
            books. We're dedicated to giving you the very best of literature,
            with a focus on quality, selection, and customer service.
          </p>
          <p className="about-text">
            Founded in 2023, our store has come a long way from its beginnings.
            We now serve customers all over the country and are thrilled to be a
            part of the literary world.
          </p>
          <p className="about-text">
            We hope you enjoy our collection as much as we enjoy offering them
            to you. If you have any questions or comments, please don't hesitate
            to contact us.
          </p>
          <h2 className="about-subtitle">Our Mission</h2>
          <p className="about-text">
            Our mission is to provide a seamless platform for book lovers to buy
            and sell books at the best prices while promoting a love for
            reading.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
