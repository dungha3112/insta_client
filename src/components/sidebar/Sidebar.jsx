import React, { useEffect, useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Avatar from "../common/Avatar";

import logoInsta from "../../assets/images/instagram-logo.svg";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { getPosts } from "../../redux/actions/postAction";
import { getSuggestions } from "../../redux/actions/suggestedAction";
import { menuNavlink } from "../../utils/menuNavlink";
import ModalCreatePost from "../modals/ModalCreatePost";
import ModalNotifications from "../modals/ModalNotifications";
import ModalSearch from "../modals/ModalSearch";

import { IoLogOut, IoLogOutOutline } from "react-icons/io5";
import { loggout } from "../../redux/actions/authAction";
import ModalConfirm from "../modals/ModalConfirm";

const Sidebar = () => {
  const { auth, modal, notify, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState("home");
  const [isReadNotifies, setIsReadNotifies] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);
  const navigate = useNavigate();

  const handleCloseOpenSearchAndNoti = (pathname) => {
    dispatch({
      type: GLOBALTYPES.MODAL,
      payload: { search: false, noti: false, create: false, likes: false },
    });

    setSelected(pathname);
  };

  const handleOpenMore = () => {
    setModalLogout(true);
    setSelected("logout");
  };

  const handleReloadHome = () => {
    dispatch(getPosts(auth.access_token));
    dispatch(getSuggestions(auth.access_token));
    handleCloseOpenSearchAndNoti("home");
    window.scrollTo({ top: 0 });
  };

  const handleRoute = (item) => {
    setSelected(item.label);
    if (item.label === "home") {
      handleReloadHome();
    }

    if (!item.state) {
      dispatch({
        type: GLOBALTYPES.MODAL,
        payload: { search: false, noti: false, create: false, likes: false },
      });
    }

    switch (item.state) {
      case "search":
        dispatch({
          type: GLOBALTYPES.MODAL,
          payload: {
            search: !modal.search,
            noti: false,
            create: false,
            likes: false,
          },
        });
        break;

      case "create":
        dispatch({
          type: GLOBALTYPES.MODAL,
          payload: {
            search: false,
            noti: false,
            likes: false,
            create: !modal.create,
            icons: false,
          },
        });
        break;

      case "notifications":
        dispatch({
          type: GLOBALTYPES.MODAL,
          payload: {
            search: false,
            noti: !modal.noti,
            create: false,
            likes: false,
          },
        });
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const check = notify.data.map(
      (notify) => !notify.isUserReaded.includes(auth.user._id)
    );

    if (check.includes(true)) {
      setIsReadNotifies(true);
      return;
    }
    setIsReadNotifies(false);
  }, [auth.user._id, notify.data]);

  return (
    <div
      className={`${
        modal.search || modal.noti ? "w-sidebar-width-mobile" : ""
      } xl:w-sidebar-width fixed top-0 left-0 bottom-0 overflow-auto z-[998] py-8 border-r`}
    >
      <div className="p-3">
        <NavLink
          to="/"
          title="Home"
          className={`${
            modal.search || modal.noti ? "w-[44px] justify-center" : "w-full"
          } flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg hover:scale-105 transition-transform`}
          onClick={handleReloadHome}
        >
          <div
            className={`${
              modal.search || modal.noti ? "block" : "block xl:hidden"
            }`}
          >
            <FaInstagram fontSize={20} />
          </div>
          <p
            className={`${
              modal.search || modal.noti ? "hidden" : "hidden xl:block w-20"
            }`}
          >
            <img src={logoInsta} alt="logoInsta" />
          </p>
        </NavLink>

        <div className="p-3"></div>

        {menuNavlink.map((item, index) => {
          const Component = item.path ? Link : "button";

          return (
            <Component
              to={item.path || ""}
              key={index}
              title={item.label}
              className={`${
                modal.search || modal.noti
                  ? "w-[44px] justify-center"
                  : "w-full"
              } ${
                selected === item.label ? "font-bold" : ""
              }  flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg hover:scale-105 transition-transform`}
              onClick={() => handleRoute(item)}
            >
              <div className="">
                {selected === item.label ? (
                  <div className="relative">
                    <item.activeIcon fontSize={20} />
                    {item.label === "notifications" && (
                      <span className="absolute top-0 bottom-0 left-1">
                        {isReadNotifies ? (
                          <LuDot className="text-red-500" fontSize={30} />
                        ) : (
                          <></>
                        )}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <item.icon fontSize={20} />
                    {item.label === "notifications" && (
                      <span className="absolute top-0 bottom-0 left-1">
                        {isReadNotifies ? (
                          <LuDot className="text-red-500" fontSize={30} />
                        ) : (
                          <></>
                        )}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <p
                className={`${
                  modal.search || modal.noti ? "hidden" : "hidden xl:block"
                } capitalize flex items-center`}
              >
                {item.label}
              </p>
            </Component>
          );
        })}

        <NavLink
          to={`/profile/${auth.user._id}`}
          title="Profile"
          className={`${
            modal.search || modal.noti ? "w-[44px] justify-center" : "w-full"
          } flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg hover:scale-105 transition-transform`}
          onClick={() => handleCloseOpenSearchAndNoti("profile")}
        >
          <div>
            <Avatar
              url={`${auth.user.avatar}`}
              classname={`${
                selected === "profile" ? " border-[0.5px] border-black" : ""
              } small-avatar items-center flex`}
            />
          </div>

          <p
            className={`${
              modal.search || modal.noti ? "hidden" : "hidden xl:block"
            } `}
          >
            Profile
          </p>
        </NavLink>

        <div className="w-full inline-block text-left">
          <button
            title="Logout"
            className={`${
              modal.search || modal.noti ? "justify-center" : "w-full"
            } ${
              selected === "logout" ? "font-bold" : ""
            } flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg hover:scale-105 transition-transform`}
            onClick={handleOpenMore}
          >
            <div>
              {selected === "logout" ? (
                <IoLogOut fontSize={20} />
              ) : (
                <IoLogOutOutline fontSize={20} />
              )}
            </div>
            <p
              className={`${
                modal.search || modal.noti ? "hidden" : "hidden xl:block"
              } `}
            >
              Logout
            </p>
          </button>
        </div>
      </div>

      {modal.search && <ModalSearch />}
      {modal.noti && <ModalNotifications />}

      {modalLogout && (
        <ModalConfirm
          des="Are you sure to want logout?"
          textYes="Yes"
          onClickYes={() => {
            navigate("/");
            dispatch(loggout({ auth, socket }));
          }}
          onClickNo={() => setModalLogout(false)}
          textNo="Cancel"
        />
      )}
      {modal.create && <ModalCreatePost />}
    </div>
  );
};

export default Sidebar;
