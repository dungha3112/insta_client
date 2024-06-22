import { FaHeart, FaRegHeart, FaSearch } from "react-icons/fa";
import { FaMessage, FaRegMessage } from "react-icons/fa6";
import {
  IoMdAddCircle,
  IoMdAddCircleOutline,
  IoMdSearch,
} from "react-icons/io";
import { IoHomeOutline, IoHomeSharp } from "react-icons/io5";
import { MdExplore, MdOutlineExplore } from "react-icons/md";

export const menuNavlink = [
  {
    label: "home",
    icon: IoHomeOutline,
    path: "/",
    activeIcon: IoHomeSharp,
  },
  {
    label: "search",
    icon: IoMdSearch,
    activeIcon: FaSearch,
    state: "search",
  },
  {
    label: "explore",
    icon: MdOutlineExplore,
    path: "/explore",
    activeIcon: MdExplore,
  },
  {
    label: "message",
    icon: FaRegMessage,
    path: "/message",
    activeIcon: FaMessage,
  },
  {
    label: "notifications",
    icon: FaRegHeart,
    activeIcon: FaHeart,
    state: "notifications",
  },
  {
    label: "create",
    icon: IoMdAddCircleOutline,
    activeIcon: IoMdAddCircle,
    state: "create",
  },
];
