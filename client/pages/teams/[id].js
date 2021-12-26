import useSWR from "swr";
import { io } from "socket.io-client";

import Layout from "../../components/Layout";
import TeamList from "../../components/TeamList";
import { useContext, useState, useEffect, useRef } from "react";
import { AlertContext } from "../_app";
import Modal from "react-modal";
import useSound from "use-sound";

const fetcher = (args) => fetch(args).then((res) => res.json());
const WS_URL = "http://localhost:8000";
Modal.setAppElement("#__next");

// open socket in this copmonent only

export default function Team({ id, name }) {
  // const socket = io.connect("http://localhost:8000");
  const socketRef = useRef(null);
  const SOCKET_ROOM = `${id}-${name}`
  const [playMusic] = useSound("/sfx/oscars.mp3");
  const [playAlarm] = useSound("/sfx/alarm.mp3");

  const { setActiveAlert } = useContext(AlertContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [memberSelected, setSelectedMember] = useState(null);
  const [submitIsDisabled, setSubmitDisabled] = useState(false);

  // const { data } = useSWR(`http://localhost:8000/teams/${id}/members`, fetcher);
  const [members, setMembers] = useState([]);
  // console.log("memes", members);

  useEffect(() => {
    // set initial member data
    // console.log("??", data)
    // const data = ;
    
    fetchMemberData().then(data => {
      // console.log("fetched ", data?.members);
      setMembers(data?.members)
    });
    // setMembers(fetchedMembers);

    // if (data?.members) setMembers(data.members);

    if (socketRef.current == null) {
      socketRef.current = io(WS_URL);
    }

    const { current: socket } = socketRef;

    socket.on("connect", () => {
      console.log("CONNECTED:", socket.id);

      socket.emit("join-room", SOCKET_ROOM);
    });

    socket.on("alarm", (isAlarmOn) => {
      console.log("client alarm triggered", socket.id, isAlarmOn);

      setActiveAlert(isAlarmOn);
    });

    socket.on("update-member", (updatedMember) => {
      console.log("update members state with this: ", updatedMember)
      console.log(updatedMember.id)
      console.log("memos", members);

      setMembers(existingMembers => {
        console.log('mem set', [...existingMembers])

        const updatedMembers = updateMemberBasedOnId([...existingMembers], updatedMember)

        return updatedMembers;
      });
    });

    return () => {
      console.log("unmounting ", socket);
      socket.disconnect();
    };
  }, []);

  function fetchMemberData() {
    return fetch(`http://localhost:8000/teams/${id}/members`).then(res => res.json());
  }

  function activateAlert() {
    console.log("Fire donut event for everyone");
    openModal();

    // setActiveAlert(true);
    playAlarm();
    console.log("trigger alarm socket");
    socketRef.current?.emit("trigger-alarm", SOCKET_ROOM);

    setTimeout(() => {
      // setActiveAlert(false);
      socketRef.current?.emit("stop-alarm", SOCKET_ROOM);
    }, 2500);
  }

  function openModal() {
    setIsOpen(true);
    setSelectedMember(null);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function selectMember(memberItem) {
    if (members) {
      console.log(memberItem);
      setSelectedMember(memberItem);
    }
  }

  function sortMembers(members) {
    if (!members || !members.length) {
      return [];
    }
    // console.log("sort em");
    return members && [...members].sort((a, b) => b.donutCount - a.donutCount);
  }

  async function increaseDonutCount() {
    const selectedMember = members.find(
      (m) => m.id === memberSelected?.id
    );
    console.log(selectedMember);
    if (selectedMember) {
      // selectedMember.donutCount++;

      // console.log("send this as POST: ", selectedMember);

      setSubmitDisabled(true);

      const updatedMember = {
        ...selectedMember,
        donutCount: selectedMember.donutCount + 1
      }

      await updateTeamMember(updatedMember);

      // socket.emit("donut-add");
      setSubmitDisabled(false);
    }

    closeModal();
  }

  async function updateTeamMember(member) {
    console.log("update memer", member);
    socketRef.current?.emit("update-member", member, SOCKET_ROOM);

    // const requestOptions = {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(member),
    // };

    // console.log(requestOptions);

    // return await fetch(
    //   `http://localhost:8000/teamMembers/${member.id}`,
    //   requestOptions
    // );
  }

  function updateMemberBasedOnId(existingMembers, updatedMember) {
    const existingMemberIndex = existingMembers.findIndex((m) => {
      console.log("mid", m.id);
      return m.id === updatedMember.id;
    });

    console.log(existingMemberIndex);
    if (existingMemberIndex !== -1) {
      const updatedMembers = [
        ...existingMembers.slice(0, existingMemberIndex),
        updatedMember,
        ...existingMembers.slice(existingMemberIndex + 1), // exlude existingMember
      ];

      console.log('upmemz', updatedMembers)

      return updatedMembers;
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl text-center uppercase my-4 text-shadow text-pink-500">
        {name}
      </h1>
      <TeamList members={sortMembers(members)} />
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
            {members?.length &&
              members.map((member) => (
                <li key={member.id}>
                  <button
                    onClick={() => selectMember(member)}
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
