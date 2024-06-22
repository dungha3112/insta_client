import { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import LoadIcon from "../../assets/images/loading.gif";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { deleteDataAPI, getDataAPI, putDataAPI } from "../../utils/fetchData";
import TextInput from "../common/TextInput";
import UserCard from "../common/UserCard";
import ModalConfirm from "./ModalConfirm";
import { useNavigate } from "react-router-dom";

const ModalSearch = () => {
  const { modal, auth } = useSelector((state) => state);
  const [historySearch, setHistorySearch] = useState([]);

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSearchUser = async () => {
      setLoading(true);
      try {
        const res = await getDataAPI(
          `user/search?username=${search}`,
          String(auth.access_token)
        );
        setUsers(res.data.users);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    if (search) {
      handleSearchUser();
    }
  }, [auth.access_token, search]);

  useEffect(() => {
    const handleGetHistorySearch = async () => {
      const res = await getDataAPI(`user/history-search`, auth.access_token);
      setHistorySearch(res.data);
    };
    handleGetHistorySearch();
  }, [auth.access_token, dispatch]);

  const handleAddUserToListUserSearch = async (user) => {
    navigate(`/profile/${user._id}`);
    if (historySearch.every((item) => item._id !== user._id)) {
      setHistorySearch([...historySearch, user]);
    }
    await putDataAPI(
      `user/add-history-search/${user._id}`,
      {},
      auth.access_token
    );

    dispatch({ type: GLOBALTYPES.MODAL, payload: { search: false } });
  };

  const handleDeleteHistorySearch = async () => {
    await deleteDataAPI(`user/history-search`, auth.access_token);
    setHistorySearch([]);
    dispatch({ type: GLOBALTYPES.MODAL, payload: { confirm: false } });
  };

  const handleDeleteUserToHistorySearch = async (user) => {
    await putDataAPI(`user/history-delete/${user._id}`, {}, auth.access_token);
    const newData = historySearch.filter((item) => item._id !== user._id);
    setHistorySearch(newData);
  };

  return (
    <div
      className={`fixed top-0 left-[var(--sidebar-width-mobile)] w-[calc(100vw-90px)] xs:w-width-modal transition duration-300 ease-in-out shadow-2xl bg-white h-full rounded-tr-xl rounded-br-xl z-[9999] ${
        modal.search ? "opacity-100 " : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Search</h1>
          <IoMdCloseCircle
            fontSize={28}
            onClick={() =>
              dispatch({
                type: GLOBALTYPES.MODAL,
                payload: { search: false },
              })
            }
            className="cursor-pointer hover:text-red-500"
          />
        </div>
        <div className="pt-2" />

        <div className="relative">
          <TextInput
            value={search}
            trim={true}
            setValue={setSearch}
            type="text"
            placeholder="Search username ..."
          />
          <button
            disabled={loading}
            className="absolute top-[50%] right-2 -translate-y-1/2 cursor-pointer hover:text-red-500"
          >
            {loading ? (
              <img src={LoadIcon} alt="LoadIcon" className="w-4" />
            ) : (
              <IoMdCloseCircle
                fontSize={18}
                onClick={() => {
                  setUsers([]);
                  setSearch("");
                }}
              />
            )}
          </button>
        </div>
      </div>
      <hr className="pt-2" />

      <div className="w-full flex flex-col transition h-full overflow-y-auto">
        {search ? (
          loading ? (
            <img src={LoadIcon} alt="LoadIcon" className="w-10 mx-auto" />
          ) : users.length ? (
            users.map((user) => (
              <div
                key={user._id}
                className="cursor-pointer bg-white px-4 hover:bg-gray-100 p-2"
                onClick={() => handleAddUserToListUserSearch(user)}
              >
                <UserCard user={user} />
              </div>
            ))
          ) : (
            <div className="pl-4 relative w-full h-full">
              <span className="absolute font-semibold text-sm opacity-75 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                No results found.
              </span>
            </div>
          )
        ) : historySearch.length > 0 ? (
          <>
            <div className="p-4 flex items-center justify-between">
              <span className="font-bold">Recent</span>

              {historySearch.length > 0 ? (
                <span
                  className="cursor-pointer text-sm select-none"
                  onClick={() =>
                    dispatch({
                      type: GLOBALTYPES.MODAL,
                      payload: { confirm: true },
                    })
                  }
                >
                  Clear all
                </span>
              ) : (
                <></>
              )}
            </div>
            {historySearch.map((user) => (
              <div
                key={user._id}
                className="flex items-center cursor-pointer bg-white px-4 hover:bg-gray-100 p-2 relative"
              >
                <div
                  className="w-full"
                  onClick={() => handleAddUserToListUserSearch(user)}
                >
                  <UserCard user={user} />
                </div>
                <IoMdCloseCircle
                  title="Remove"
                  fontSize={18}
                  className="cursor-pointer hover:text-red-500 absolute right-4"
                  onClick={() => handleDeleteUserToHistorySearch(user)}
                />
              </div>
            ))}
          </>
        ) : (
          <div className="pl-4 relative w-full h-full">
            <span className="font-bold">Recent</span>
            <span className="absolute font-semibold text-sm opacity-75 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              No recent searches.
            </span>
          </div>
        )}
      </div>
      {modal.confirm && (
        <ModalConfirm
          title="Clear search history?"
          des="You won't be able to undo this. If you clear your search history, you may still see accounts you've searched for as suggested results."
          textYes="Clear all"
          onClickYes={handleDeleteHistorySearch}
          textNo="Not now"
        />
      )}
    </div>
  );
};

export default ModalSearch;
