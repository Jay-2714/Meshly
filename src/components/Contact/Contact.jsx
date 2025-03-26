import React from "react";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <div className="err-container">
      <h1>A 3D Marketplace</h1>
      <h2>
        Reach out to Project Admin at{" "}
        <Link
          target="_blank"
        >
          LinkedIn
        </Link>{" "}
        and{" "}
        <Link target="_blank">
          jaysanjaymhatre2714@gmail.com
        </Link>
      </h2>
    </div>
  );
};

export default Contact;
