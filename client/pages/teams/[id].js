import useSWR from "swr";
import Layout from "../../components/Layout";
import TeamList from "../../components/TeamList";
import { useContext } from "react";
import { AlertContext } from "../_app";
// import { fetcher } from "../../services/members";

const fetcher = (args) => fetch(args).then((res) => res.json());

export default function Team({ id, name }) {
  const { data } = useSWR(`http://localhost:8000/teams/${id}/members`, fetcher);

  console.log("teamData", data);

  const { isAlertActive, setActiveAlert } = useContext(AlertContext);

  function activateAlert() {
    // e.preventDefault();

    console.log("Fire donut event for everyone");
    setActiveAlert(true);
  }

  return (
    <Layout>
      <h1 className="text-2xl text-center my-4">{name}</h1>
      <TeamList members={data?.members} />
      <footer className="fixed bottom-0 left-0 h-auto bg-gray-500 w-full">
        <div className="container mx-auto p-4 text-center">
          <button
            className="p-4 bg-black text-white focus:ring focus:ring-violet-300"
            onClick={activateAlert}
          >
            DONUTS
          </button>
        </div>
      </footer>
    </Layout>
  );
}

export async function getStaticPaths() {
  const res = await fetch("http://localhost:8000/teams");
  const { teams } = await res.json();

  const paths = teams.map((team) => ({
    params: { id: team.id.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`http://localhost:8000/teams/${params.id}`);

  const { team } = await res.json();

  return {
    props: team,
  };
}
