import Layout from "../../components/Layout";
import TeamList from "../../components/TeamList";

// import { getTeams } from "../../services/TeamService";

export default function Team({ id, name }) {
  return (
    <Layout>
      <h1>{name}</h1>
      <TeamList />
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
