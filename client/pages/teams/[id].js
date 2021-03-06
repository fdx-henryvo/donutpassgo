import { io } from "socket.io-client";

import Layout from "../../components/Layout";
import TeamList from "../../components/TeamList";
import { useContext, useState, useEffect, useRef } from "react";
import { AlertContext } from "../_app";
import Modal from "react-modal";
import useSound from "use-sound";

const fetcher = (args) => fetch(args).then((res) => res.json());
const API_URL = process.env.API_URL;
const WS_URL = process.env.WS_URL;
Modal.setAppElement("#__next");

// open socket in this copmonent only

export default function Team({ id, name }) {
  // const socket = io.connect("http://52.64.24.209/api");
  const socketRef = useRef(null);
  const SOCKET_ROOM = `${id}-${name}`;
  const [playMusic] = useSound("/sfx/oscars.mp3");
  const [playAlarm] = useSound("/sfx/alarm.mp3");

  // let audio = new Audio("/sfx/oscars.mp3");
  const { setActiveAlert } = useContext(AlertContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [musicModalIsOpen, setMusicModalIsOpen] = useState(false);
  const [memberSelected, setSelectedMember] = useState(null);
  const [submitIsDisabled, setSubmitDisabled] = useState(false);
  const [donutButtonIsDisabled, setDonutButtonDisabled] = useState(false);

  const [members, setMembers] = useState([]);

  useEffect(() => {
    // set initial member data
    // console.log("??", data)
    // const data = ;

    fetchMemberData().then((data) => {
      // console.log("fetched ", data?.members);

      const membersWithPhotos = data?.members.map((member) => {
        return {
          ...member,
          photoPath: getPhotoUrl(member.id),
        };
      });

      setMembers(membersWithPhotos);
    });

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
      playAlarm();
    });

    socket.on("play-music", (isPlaying) => {
      console.log("play it", isPlaying);
      // console.log(playMusic)
      // startAudio();
      if (!musicModalIsOpen) setMusicModalIsOpen(true);
    });

    socket.on("update-member", (updatedMember) => {
      console.log(updatedMember.id);

      setMembers((existingMembers) => {
        const updatedMembers = updateMemberBasedOnId(
          [...existingMembers],
          updatedMember
        );

        return updatedMembers;
      });
    });

    socket.on("disable-donut-button", () => {
      setDonutButtonDisabled(true);
    });
    socket.on("enable-donut-button", () => {
      setDonutButtonDisabled(false);
    });

    return () => {
      console.log("unmounting ", socket);
      socket.disconnect();
    };
  }, []);

  function fetchMemberData() {
    return fetch(`${API_URL}/teams/${id}/members`).then((res) => res.json());
  }

  function activateAlert() {
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

    // disablethebutton
    // setDonutDisable(true)
    socketRef.current?.emit("disable-donut-button", SOCKET_ROOM);
  }

  function closeModal() {
    setIsOpen(false);

    // setDonutDisable(true)
    socketRef.current?.emit("enable-donut-button", SOCKET_ROOM);
  }

  function closeMusicModal() {
    setMusicModalIsOpen(false);

    // setDonutDisable(true)
    // socketRef.current?.emit("enable-donut-button", SOCKET_ROOM);
  }

  function selectMember(memberItem) {
    if (members) {
      setSelectedMember(memberItem);
    }
  }

  function sortMembers(members) {
    if (!members || !members.length) {
      return [];
    }
    return members && [...members].sort((a, b) => b.donutCount - a.donutCount);
  }

  async function increaseDonutCount() {
    const selectedMember = members.find((m) => m.id === memberSelected?.id);
    if (selectedMember) {
      // selectedMember.donutCount++;

      setSubmitDisabled(true);

      const updatedMember = {
        ...selectedMember,
        donutCount: selectedMember.donutCount + 1,
      };

      await updateTeamMember(updatedMember);

      setSubmitDisabled(false);
    }

    closeModal();
  }

  async function updateTeamMember(member) {
    // socket will perform PUT on backend
    socketRef.current?.emit("update-member", member, SOCKET_ROOM);
  }

  function updateMemberBasedOnId(existingMembers, updatedMember) {
    const existingMemberIndex = existingMembers.findIndex((m) => {
      return m.id === updatedMember.id;
    });

    if (existingMemberIndex !== -1) {
      const updatedMembers = [
        ...existingMembers.slice(0, existingMemberIndex),
        updatedMember,
        ...existingMembers.slice(existingMemberIndex + 1), // exlude existingMember
      ];

      return updatedMembers;
    }
  }

  function getPhotoUrl(id) {
    return `${API_URL}/${id}/photo`;
  }

  function emitMusicEvent() {
    console.log("emit music", SOCKET_ROOM);
    // playMusic();
    socketRef.current?.emit("play-music", SOCKET_ROOM);
  }

  return (
    <Layout>
      <h1 className="text-2xl text-center uppercase my-4 text-shadow text-pink-500">
        {name}
      </h1>
      {members?.length ? (
        <>
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
                          src={member.photoPath}
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

          <Modal
            isOpen={musicModalIsOpen}
            onRequestClose={closeMusicModal}
            contentLabel="Music Modal"
          >
            <div className="p-8">
              <button
                onClick={closeMusicModal}
                className="absolute top-4 right-4"
              >
                X
              </button>
              <h2 className="text-center text-2xl mb-8 animate-flash">
                WRAP IT UP
              </h2>

              {/* yt embed autoplay */}
              <div className="relative h-0 pb-yt">
                <iframe
                  src="https://www.youtube.com/embed/NoXLu9Rz70g?start=45"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="video"
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
            </div>
          </Modal>

          <footer className="fixed bottom-0 left-0 h-auto w-full">
            <div className="container mx-auto p-8 md:p-24 text-center">
              <button
                className="text-xl p-4 bg-black text-white focus:ring focus:ring-pink-600 pink-text-shadow disabled:opacity-50"
                onClick={activateAlert}
                disabled={donutButtonIsDisabled}
              >
                DONUTS
              </button>

              <button
                onClick={emitMusicEvent}
                className="absolute right-8 bottom-8"
                title="Play the music"
              >
                ????
                {/* {playing ? "Music" : "???"} */}
              </button>
            </div>
          </footer>
        </>
      ) : (
        <p className="text-center mt-12">No team members</p>
      )}
    </Layout>
  );
}

export async function getStaticPaths() {
  const res = await fetch(`${API_URL}/teams`);
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
  const res = await fetch(`${API_URL}/teams/${params.id}`);

  const { team } = await res.json();

  return {
    props: team,
  };
}
