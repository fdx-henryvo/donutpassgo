import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Layout from "../components/Layout";
import styles from "../styles/Home.module.css";

export default function Home({ teams }) {
  return (
    <Layout>
      <main className={styles.main}>
        <h1 className={styles.title}>select your team</h1>

        <div className={styles.grid}>
          {teams.map((team) => (
            <Link href={`/teams/${team.id}`} key={team.id}>
              <a className="focus:ring focus:ring-pink-600">{team.name}</a>
            </Link>
          ))}
        </div>
      </main>

            {/* <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} /> */}
    </Layout>
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
