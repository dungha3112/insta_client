import logoLoaingScrren from "../../assets/images/instagram-logo-screen.svg";

const LoadingScreen = () => {
  return (
    <div className="fixed z-[999] top-0 left-0 w-full h-full flex justify-center items-center bg-white">
      <div className="flex items-center">
        <img src={logoLoaingScrren} alt="logoLoaingScrren" width={110} />
      </div>
    </div>
  );
};

export default LoadingScreen;
