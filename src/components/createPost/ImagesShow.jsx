import { IoMdCloseCircle } from "react-icons/io";
import { imageShow, videoShow } from "../../utils/mediaShow";

const ImagesShow = ({ images, setImages }) => {
  const deleteImages = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };

  return (
    <div
      className={`h-[172px] overflow-auto w-full overflow-y-auto overflow-x-hidden grid grid-cols-3 justify-items-center gap-1
    `}
    >
      {images.map((img, index) => (
        <div key={index} className="relative h-full w-full">
          {img.camera ? (
            imageShow(img.camera)
          ) : img.public_id ? (
            <>
              {img.url.match(/video/i)
                ? videoShow(img.url)
                : imageShow(img.url)}
            </>
          ) : (
            <>{img.video ? videoShow(img.video) : imageShow(img.image)}</>
          )}

          <IoMdCloseCircle
            fontSize={20}
            onClick={() => deleteImages(index)}
            className="hover:text-red-700 cursor-pointer absolute top-1 right-1"
          />
        </div>
      ))}
    </div>
  );
};

export default ImagesShow;
