export const imageShow = (src) => {
  return <img src={src} alt="images" className={`object-cover h-24 w-64`} />;
};

export const videoShow = (src) => {
  return (
    <video
      controls
      autoPlay
      src={src}
      alt="video"
      className={`object-cover h-24 w-64`}
    />
  );
};
