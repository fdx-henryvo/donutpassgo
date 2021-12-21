import React from "react";
import Link from "next/link";
// import AlertContext from "./AlertContext";

const Layout = ({ children }) => {

  return (
    <div className="container mx-auto px-4">
      <header>
        <Link href="/">
          <a>Home</a>
        </Link>
      </header>

      <main className="pb-32">{children}</main>
    </div>
  );
};

export default Layout;
