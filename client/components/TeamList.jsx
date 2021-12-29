import React, { Component } from "react";
import FlipMove from "react-flip-move";
import { ImagePixelated } from "react-pixelate";

class TeamList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
    };
  }

  renderMembers() {
    return (
      this.props.members &&
      this.props.members.map((member) => (
        <li
          key={member.id}
          className="relative text-shadow tracking-tighter uppercase mb-1"
        >
          {/* <Image src="https://via.placeholder.com/50" width="50" height="50" alt={member.name}></Image> */}
          <img
            src={member.photoPath}
            width="75"
            height="75"
            className="inline-block mr-8 border-white border-2 border-solid"
            alt={member.name}
          />

          {/* <ImagePixelated
            src="https://via.placeholder.com/150x150"
            width={500}
            height={300}
            fillTransparencyColor={"grey"}
          /> */}

          {member.name}
          <span className="absolute right-2 top-1/2 -translate-y-1/2">
            {member.donutCount}
          </span>
        </li>
      ))
    );
  }

  render() {
    return (
      <ol className="list-decimal list-inside">
        <FlipMove
          staggerDurationBy="30"
          duration={500}
          enterAnimation="none"
          leaveAnimation="none"
        >
            {this.renderMembers()}
        </FlipMove>
      </ol>
    );
  }
}

export default TeamList;

// const TeamList = ({ members }) => {
//   const sortedMembers =
//     members && [...members].sort((a, b) => b.donutCount - a.donutCount);
//   console.log(sortedMembers);

//   return (

//   );
// };

// export default TeamList;
