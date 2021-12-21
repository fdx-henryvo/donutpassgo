import React from "react";
import FlipMove from "react-flip-move";

const TeamList = ({ members }) => {
  const sortedMembers =
    members && [...members].sort((a, b) => b.donutCount - a.donutCount);
  console.log(sortedMembers);

  return (
    <ol className="list-decimal list-inside">
      <FlipMove
        staggerDurationBy="30"
        duration={500}
        enterAnimation="none"
        leaveAnimation="none"
      >
        {sortedMembers &&
          sortedMembers.map((member) => (
            <li
              key={member.id}
              className="relative mb-4 text-shadow tracking-tighter uppercase"
            >
              {/* <Image src="https://via.placeholder.com/50" width="50" height="50" alt={member.name}></Image> */}
              <img
                src="https://i.pravatar.cc/75"
                width="75"
                height="75"
                className="inline-block mr-1 -ml-2"
                alt={member.name}
              />
              {member.name}
              <span className="absolute right-2 top-1/2 -translate-y-1/2">
                {member.donutCount}
              </span>
            </li>
          ))}
      </FlipMove>
    </ol>
  );
};

export default TeamList;
