import React from "react";
import LeftSide from "../../components/message/LeftSide";
import RightSide from "../../components/message/RightSide";

const Conversation = () => {
  return (
    <div className="message flex">
      <div className="md:w-1/4 border-r px-0">
        <LeftSide />
      </div>

      <div className="md:w-3/4 px-0 w-full">
        <RightSide />
      </div>
    </div>
  );
};

export default Conversation;
