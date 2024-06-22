import { useDispatch } from "react-redux";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";

const ModalConfirm = ({
  title,
  des,
  textYes,
  onClickYes,
  textNo,
  onClickNo,
}) => {
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    if (onClickNo) onClickNo();
    dispatch({
      type: GLOBALTYPES.MODAL,
      payload: { confirm: false, morenenu_post: false, post: {} },
    });
  };

  return (
    <div className="fixed z-[99999999] inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg w-[400px]">
        <div className="flex flex-col p-8">
          <h1 className="text-center text-lg">{title}</h1>
          <span className="text-sm font-thin text-center">{des}</span>
        </div>
        <div className="flex flex-col">
          <hr />
          <div
            className="cursor-pointer p-3 text-center text-sm text-red-600 font-bold select-none"
            onClick={onClickYes}
          >
            {textYes}
          </div>
          <hr />

          <div
            className="cursor-pointer p-3 text-center text-sm select-none"
            onClick={handleCloseModal}
          >
            {textNo}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;
