import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-6 shadow-2xl shadow-black">
      <div className="mx-auto flex flex-col justify-center items-center px-4 footer-content">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-black-500 font-bold">Bahi</span>
          <span className="text-red-500 font-bold">Khata</span> | Created by
          Dharani sharadha
        </p>
        <div>
          <p>Contact: +91 9100605321</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
