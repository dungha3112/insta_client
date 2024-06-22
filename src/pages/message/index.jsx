import React from "react";
import LeftSide from "../../components/message/LeftSide";
import { SiImessage } from "react-icons/si";

const Message = () => {
  return (
    <div className="message flex" style={{ paddingBottom: "/cscs80px" }}>
      <div className="md:w-1/4 border-r px-0">
        <LeftSide />
      </div>

      <div className="md:w-3/4 px-0 w-full">
        <div className="h-full flex flex-col items-center justify-center">
          <div className="border border-[#000] rounded-full p-4">
            <SiImessage fontSize={46} className="text-blue-500" />
          </div>
          <h4 className="text-lg font-bold">Your messages</h4>
          <small>Send a message to start a chat.</small>
        </div>
      </div>
    </div>
  );
};

export default Message;
