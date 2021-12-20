import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home({ teams }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>donut • pass • go</title>
        <meta name="description" content="Donut pass go - companion app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>select your team</h1>

        <div className={styles.grid}>
          {teams.map((team) => (
            <Link href={`/teams/${team.id}`}>
              <a>{team.name}</a>
            </Link>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch("http://localhost:8000/teams");
  const { teams } = await res.json();

  return {
    props: {
      teams,
    },
  };
}
