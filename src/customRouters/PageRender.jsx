import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NotFound from "../components/NotFound";
import { useSelector } from "react-redux";

const generaPage = (pageName) => {
  const component = () => require(`../pages/${pageName}`).default;
  try {
    return React.createElement(component());
  } catch (error) {
    return <NotFound />;
  }
};

const PageRender = () => {
  const { page, id } = useParams();

  const { access_token } = useSelector((state) => state.auth);
  let pageName = "";
  const navigate = useNavigate();

  if (id !== undefined) {
    pageName = `${page}/[id]`;
  } else {
    pageName = `${page}`;
  }

  useEffect(() => {
    if (!access_token) {
      navigate("/");
    }
  }, [access_token, navigate]);

  return generaPage(pageName);
};

export default PageRender;
