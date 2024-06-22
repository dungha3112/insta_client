export const checkImage = (file) => {
  let err = "";
  if (!file) return (err = "File does not exits.");

  if (file.size > 1024 * 1024 * 20) err = "The largest image size is 20mb.";

  if (file.type !== "image/jpeg" && file.type !== "image/png")
    err = "Image format is incorrect.";

  return err;
};

export const imageUpload = async (images) => {
  let imgArr = [];
  for (const item of images) {
    const formData = new FormData();

    // if (item.camera) {
    //   formData.append("file", item.camera);
    // } else if (item.video) {
    //   formData.append("file", item.video);
    // } else if (item.image) {
    //   formData.append("file", item.image);
    // } else {
    //   formData.append("file", item);
    // }
    switch (true) {
      case item.camera !== undefined:
        formData.append("file", item.camera);
        break;
      case item.video !== undefined:
        formData.append("file", item.file);
        break;
      case item.image !== undefined:
        formData.append("file", item.file);
        break;
      default:
        formData.append("file", item);
        break;
    }

    formData.append("upload_preset", "multi-vendor");
    formData.append("cloud_name", "dunghaqn");

    const res = await fetch("https://api.cloudinary.com/v1_1/dunghaqn/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    imgArr.push({ public_id: data.public_id, url: data.secure_url });
  }
  return imgArr;
};
