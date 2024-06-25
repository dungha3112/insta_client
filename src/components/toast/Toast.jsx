import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Toast = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { error, loading } = useSelector((state) => state.alert);

  const onClickYes = () => {
    dispatch({ type: GLOBALTYPES.ALERT, payload: {} });
    if (pathname === "/signup") {
      return navigate("/signup");
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

      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative w-24 h-24">
            <div className="absolute top-0 left-0 w-full h-full bg-blue-500 rounded-full opacity-75 animate-ping"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-blue-500 rounded-full opacity-75 animate-ping animation-delay-200"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-blue-500 rounded-full opacity-75 animate-ping animation-delay-400"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toast;
