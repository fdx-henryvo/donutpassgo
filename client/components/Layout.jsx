import React from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
// import AlertContext from "./AlertContext";

const Layout = ({ children }) => {

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>donut • pass • go</title>
        <meta name="description" content="Donut pass go - companion app" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="preload"
          href="/fonts/PressStart2p.ttf"
          as="font"
          crossOrigin=""
        />
      </Head>
      <header className="my-4">
        <Link href="/">
          <a title="Home">
            <Image
              src="/donut_pink2.png"
              height="40"
              width="40"
            ></Image>
          </a>
        </Link>
      </header>

      <main className="pb-32">{children}</main>
    </div>
  );
};

export default Layout;
