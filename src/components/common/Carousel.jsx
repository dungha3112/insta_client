import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = ({ images }) => {
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          position: "absolute",
          zIndex: "10",
          right: "5px",
        }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          position: "absolute",
          zIndex: "10",
          left: "5px",
        }}
        onClick={onClick}
      />
    );
  }

  const settings = {
    dots: true,
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: images.length > 1 && <SampleNextArrow />,
    prevArrow: images.length > 1 && <SamplePrevArrow />,
    appendDots: (dots) => (
      <div style={{ position: "absolute" }}>
        <ul
          style={{
            display: "flex",
            position: "relative",
            top: "-35px",
            justifyContent: "center",
          }}
        >
          {dots}
        </ul>
      </div>
    ),
  };

  return (
    <Slider {...settings}>
      {images.map((img, index) => (
        <div key={index}>
          {img.url.match(/video/i) ? (
            <video
              key={img.public_id}
              controls
              src={img.url}
              className="d-block w-full h-[calc(100vh-72px)] object-cover"
              alt={img.url}
            />
          ) : (
            <img
              key={img.public_id}
              src={img.url}
              className="d-block w-full h-[calc(100vh-72px)] object-cover"
              alt={img.url}
            />
          )}
        </div>
      ))}
    </Slider>
  );
};

export default Carousel;
