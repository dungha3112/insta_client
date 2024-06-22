import { combineReducers } from "redux";
import modal from "./modalReducer";
import auth from "./aurhReducer";
import profile from "./profileReducer";
import alert from "./alertReducer";
import homePosts from "./postReducer";
import detailPost from "./postDetailReducer";
import explore from "./exploreReducer";
import suggestions from "./suggestedReducer";
import socket from "./socketReducer";
import notify from "./notifyReducer";
import message from "./messageReducer";
import online from "./onlineReducer";
import call from "./callReducer";
import peer from "./peerReducer";

export default combineReducers({
  auth,
  modal,
  profile,
  alert,
  homePosts,
  detailPost,
  explore,
  suggestions,
  socket,
  notify,
  message,
  online,
  call,
  peer,
});
