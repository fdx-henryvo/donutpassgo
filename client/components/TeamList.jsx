import Image from "next/image";
import React from "react";

const TeamList = ({ members }) => {
  console.log("MEMBO", members);
  return (
    <ol className="list-decimal list-inside">
      {members &&
        members.map((member) => (
          <li key={member.id} className="relative mb-4">
            {/* <Image src="https://via.placeholder.com/50" width="50" height="50" alt={member.name}></Image> */}
            <img src="https://i.pravatar.cc/75" width="75" height="75" className="inline-block mr-4" alt={member.name} />
            {member.name}
            <span className="absolute right-2 top-1/2 -translate-y-1/2">{member.donutCount}</span>
          </li>
        ))}
    </ol>
  );
};

export default TeamList;
