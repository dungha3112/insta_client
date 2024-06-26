import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logoInsta from "../assets/images/instagram-logo.svg";
import TextInput from "../components/common/TextInput";
import TextButton from "../components/common/TextButton";
import { login } from "../redux/actions/authAction";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { access_token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSigin = async (e) => {
    e.preventDefault();
    const data = { email, password };
    dispatch(login(data));
  };

  useEffect(() => {
    if (access_token) navigate("/");
  }, [access_token, navigate]);

  return (
    <div className="w-full p-3 max-w-[350px] fixed flex flex-col gap-3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <form
        onSubmit={handleSigin}
        className="border px-8 py-6 flex flex-col gap-3"
      >
        <div className="flex flex-col items-center justify-center">
          <img src={logoInsta} alt="logoInsta" className="w-32" />
        </div>

        <TextInput
          value={email}
          setValue={setEmail}
          required
          type="email"
          placeholder="Enter email ..."
        />

        <TextInput
          value={password}
          setValue={setPassword}
          type="password"
          required
          placeholder="Enter password ..."
        />
        <TextButton type="submit" title="Sign In" />
      </form>

      <div className="border px-8 py-6">
        <p className="text-sm text-center">
          Don't have an account?
          <Link to="/signup" className="hover:text-red-500 transition">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
