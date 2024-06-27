import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import logoInsta from "../assets/images/instagram-logo.svg";
import TextButton from "../components/common/TextButton";
import TextInput from "../components/common/TextInput";
import { signUp } from "../redux/actions/authAction";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const data = { email, password, fullname, username };
    setLoading(true);
    await dispatch(signUp(data));
    setLoading(false);
  };
  return (
    <div className="w-full p-3 max-w-[350px] fixed flex flex-col gap-3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <form
        onSubmit={handleSignUp}
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
          placeholder="Email ..."
        />

        <TextInput
          value={fullname}
          setValue={setFullname}
          required
          type="text"
          placeholder="Full name ..."
        />
        <TextInput
          value={username.toLowerCase().replace(/ /g, "")}
          setValue={setUsername}
          required
          type="text"
          placeholder="Username ..."
        />

        <TextInput
          value={password}
          setValue={setPassword}
          required
          type="password"
          placeholder="Password ..."
        />

        <TextButton
          type="submit"
          title={loading ? "Loading ..." : "Sign up"}
          dispatch={loading}
        />
      </form>

      <div className="border px-8 py-6">
        <p className="text-sm text-center">
          Have an account?
          <Link to="/" className="hover:text-red-500 transition">
            SignIn
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
