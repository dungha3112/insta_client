const TextareaInput = ({ content, setContent }) => {
  const handleChangeTextarea = (e) => {
    setContent(e.target.value);
  };
  return (
    <textarea
      name="content"
      placeholder={`Write somethings...`}
      value={content}
      onChange={handleChangeTextarea}
      className="w-full min-h-[150px] border-none outline-none resize-none"
    />
  );
};

export default TextareaInput;
