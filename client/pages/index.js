import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Layout from "../components/Layout";
import styles from "../styles/Home.module.css";

export default function Home({ teams }) {
  return (
    <Layout>
      <main className={styles.main}>
        <h1 className={styles.title}>PRESS START</h1>

        <div className={styles.grid}>
          <div className="flex flex-col border-black border-4 border-solid p-8 pr-14 mt-8">
            <h2 className="-mt-12 bg-papaya px-4">select your team</h2>
            {teams.map((team) => (
              <Link href={`/teams/${team.id}`} key={team.id}>
                {/* <a className="focus:ring focus:ring-pink-600 m-4">
                <span className="text-center h-16 flex justify-center items-center w-16 mx-auto mb-4 bg-black text-white align-middle">{team.name[0]}</span>
                {team.name}
              </a> */}
                <a className="team-select focus:ring focus:ring-pink-600 mt-2">
                  <span className="team-select__arrow text-2xl mr-2 ">🠶</span>
                  {team.name}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} /> */}
    </Layout>
  );
}

export async function getStaticProps() {
  const res = await fetch("http://52.64.24.209/api/teams");
  const { teams } = await res.json();

  return {
    props: {
      teams,
    },
  };
}
