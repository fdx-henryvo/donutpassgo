import useSWR from "swr";
import Layout from "../../components/Layout";
import TeamList from "../../components/TeamList";
import { useContext, useState } from "react";
import { AlertContext } from "../_app";
import Modal from "react-modal";
import useSound from "use-sound";

const fetcher = (args) => fetch(args).then((res) => res.json());
Modal.setAppElement("#__next");

export default function Team({ id, name }) {
  const { data } = useSWR(`http://localhost:8000/teams/${id}/members`, fetcher);
  const [playMusic, { stop }] = useSound("/sfx/oscars.mp3");
  const [playAlarm] = useSound("/sfx/alarm.mp3");

  console.log("teamData", data);

  const { setActiveAlert } = useContext(AlertContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [memberSelected, setSelectedMember] = useState({ id: "", name: "" });
  const [submitIsDisabled, setSubmitDisabled] = useState(false);

  function activateAlert() {
    console.log("Fire donut event for everyone");
    // setIsOpen(true);
    openModal();

    setActiveAlert(true);
    playAlarm();
    setTimeout(() => {
      setActiveAlert(false);
    }, 2500);
  }

  function openModal() {
    setIsOpen(true);
    setSelectedMember({
      id: "",
      name: "",
    });
  }

  function closeModal() {
    setIsOpen(false);
  }

  function selectMember(id) {
    console.log("ID", id);
    if (data?.members) {
      const member = data.members.find((member) => member.id === id);
      console.log(member);
      setSelectedMember({
        id: member.id,
        name: member.name,
      });
    }
  }

  function sortMembers(members) {
    console.log("sort em");
    //   [...members].sort((a, b) => b.donutCount - a.donutCount)

    return members && [...members].sort((a, b) => b.donutCount - a.donutCount);
  }

  async function increaseDonutCount() {
    const selectedMember = data?.members?.find(
      (m) => m.id === memberSelected?.id
    );
    if (selectedMember) {
      selectedMember.donutCount++;

      console.log("send this as POST: ", selectedMember);

      setSubmitDisabled(true);
      await updateTeamMember(selectedMember);
      setSubmitDisabled(false);
    }

    closeModal();
  }

  async function updateTeamMember(member) {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    };

    console.log(requestOptions);

    return await fetch(
      `http://localhost:8000/teamMembers/${member.id}`,
      requestOptions
    );

    //   return res.json();
  }

  return (
    <Layout>
      <h1 className="text-2xl text-center uppercase my-4 text-shadow text-pink-500">
        {name}
      </h1>
      <TeamList members={sortMembers(data?.members)} />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Select Modal"
      >
        <div className="p-8">
          <button onClick={closeModal} className="absolute top-4 right-4">
            X
          </button>
          <h2 className="text-center text-2xl mb-8">PLAYER SELECT</h2>

          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {data?.members &&
              data.members?.map((member) => (
                <>
                  <li key={member.id}>
                    <button
                      onClick={() => selectMember(member.id)}
                      className="focus:ring focus:ring-pink-600 bg-gray-300 rounded-sm"
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
                </>
              ))}
          </ul>

          <div className="text-center mt-8">
            <button
              onClick={increaseDonutCount}
              disabled={submitIsDisabled}
              className="text-center bg-black text-white p-4 uppercase"
            >
              {/* {submitIsDisabled && "Loading"} */}
              {/* {submitIsDisabled} */}
              {memberSelected?.name ? memberSelected?.name : "WHO"}

              <span> GETS A DONUT</span>
              {!memberSelected?.name && "?"}
            </button>
          </div>
        </div>
      </Modal>
      <footer className="fixed bottom-0 left-0 h-auto w-full">
        <div className="container mx-auto p-8 md:p-24 text-center">
          <button
            className="text-xl p-4 bg-black text-white focus:ring focus:ring-pink-600 pink-text-shadow"
            onClick={activateAlert}
          >
            DONUTS
          </button>

          <button onClick={playMusic} className="absolute right-8 bottom-8">
            Music
            {/* {playing ? "Music" : "■"} */}
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
    params: { id: team?.id.toString() },
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
