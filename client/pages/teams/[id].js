import useSWR from "swr";
import Layout from "../../components/Layout";
import TeamList from "../../components/TeamList";
import { useContext, useState } from "react";
import { AlertContext } from "../_app";
import Modal from "react-modal";

const fetcher = (args) => fetch(args).then((res) => res.json());
Modal.setAppElement("#__next");

export default function Team({ id, name }) {
  const { data } = useSWR(`http://localhost:8000/teams/${id}/members`, fetcher);

  console.log("teamData", data);

  const { setActiveAlert } = useContext(AlertContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [memberSelected, setSelectedMember] = useState({id: "", name: ""});

  function activateAlert() {
    console.log("Fire donut event for everyone");
    setIsOpen(true);

    setActiveAlert(true);
    setTimeout(() => {
      setActiveAlert(false);
    }, 3000);
  }

  function closeModal() {
    setIsOpen(false);

    setSelectedMember({
      id: "",
      name: "",
    });
  }

  function selectMember(id) {
      console.log("ID",id)
      if (data?.members) {
          
          const member = data.members.find((member) => member.id === id);
          console.log(member);
          setSelectedMember({
              id: member.id,
              name: member.name
          })
      }
  }

  return (
    <Layout>
      <h1 className="text-2xl text-center my-4">{name}</h1>
      <TeamList members={data?.members} />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <button onClick={closeModal} className="absolute top-4 right-4">
          X
        </button>
        <h2 className="mb-4">Who done deserve da donut?</h2>

        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {data?.members &&
            data.members?.map((member) => (
              <>
                <li key={member.id}>
                  <button
                    onClick={() => selectMember(member.id)}
                    className="focus:ring focus:ring-blue-800 bg-gray-300 rounded-sm"
                  >
                    <img
                      src={member.photoUrl}
                      height="150"
                      width="150"
                      alt={member.name}
                    />
                    <span className="uppercase text-xs">
                      {member.name.split(" ")[0]}
                    </span>
                  </button>
                </li>
                {/* <li key={member.id}>
                  <button>
                    <img
                      src={member.photoUrl}
                      height="150"
                      width="150"
                      alt={member.name}
                    />
                    <span className="uppercase text-xs">
                      {member.name.split(" ")[0]}
                    </span>
                  </button>
                </li>
                <li key={member.id}>
                  <button>
                    <img
                      src={member.photoUrl}
                      height="150"
                      width="150"
                      alt={member.name}
                    />
                    <span className="uppercase text-xs">
                      {member.name.split(" ")[0]}
                    </span>
                  </button>
                </li> */}
              </>
            ))}
        </ul>

        <div className="text-center mt-8">
          <button className="text-center bg-black text-white p-4 uppercase">
            {memberSelected?.name ? memberSelected?.name : "WHO"}

            <span> GETS A DONUT</span>
            {!memberSelected?.name && "?"}
          </button>
        </div>
      </Modal>
      <footer className="fixed bottom-0 left-0 h-auto bg-gray-500 w-full">
        <div className="container mx-auto p-4 text-center">
          <button
            className="p-4 bg-black text-white focus:ring focus:ring-blue-800"
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
