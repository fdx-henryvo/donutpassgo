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
        <link
          rel="preload"
          href="/fonts/PressStart2p.ttf"
          as="font"
          crossOrigin=""
        />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>select your team</h1>

        <div className={styles.grid}>
          {teams.map((team) => (
            <Link href={`/teams/${team.id}`} key={team.id}>
              <a>{team.name}</a>
            </Link>
          ))}
        </div>
      </main>

            {/* <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} /> */}
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
