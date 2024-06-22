import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import React from "react";

const Icons = ({ setOpenIcons, openIcons, changeIcons, classname }) => {
  const showPicker = () => {
    setOpenIcons(!openIcons);
  };
  return (
    <div className="relative w-max select-none">
      <span className="cursor-pointer" onClick={showPicker}>
        😄
      </span>
      {openIcons && (
        <div className={`z-[99999] absolute ${classname}`}>
          <div className="">
            <Picker
              theme="dark"
              data={data}
              onEmojiSelect={changeIcons}
              size={16}
              reactionsDefaultOpen={true}
            />
          </div>

          {/* 
          <EmojiPicker
            height={350}
            width={350}
            theme={true}
            reactionsDefaultOpen={true}
            onEmojiClick={changeIcons}
          /> */}
        </div>
      )}
    </div>
  );
};

export default Icons;
