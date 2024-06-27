import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";

const Toast = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { error } = useSelector((state) => state.alert);

  const onClickYes = () => {
    dispatch({ type: GLOBALTYPES.ALERT, payload: {} });
    if (pathname === "/signup" || pathname === "/signup/") {
      return navigate("/signup");
    } else if (pathname === "/setting" || pathname === "/setting/") {
      return navigate("/setting");
    } else {
      return navigate("/");
    }
  };

  return (
    <div className="fixed z-[99999999] inset-0 flex items-center justify-center bg-white text-black">
      {error && (
        <div className="bg-red-600 rounded-lg w-[400px]">
          <div className="flex flex-col p-8">
            <h1 className="text-center text-lg">Errors</h1>
            <span className="text-sm font-thin text-center">{error}</span>
          </div>
          <div className="flex flex-col">
            <hr />
            <div
              className="cursor-pointer p-3 text-center text-sm font-bold select-none"
              onClick={onClickYes}
            >
              OK
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toast;
