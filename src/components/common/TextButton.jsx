const TextButton = ({ title, ...props }) => {
  return (
    <div className="pt-4">
      <button
        className="w-full bg-green-500 hover:bg-opacity-55 transition text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline text-sm"
        {...props}
      >
        {title}
      </button>
    </div>
  );
};

export default TextButton;
