import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "../../src/assets/images/logo_UIT.png";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="bg-slate-300">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <p className="flex justify-center items-center gap-2">
            <img className="max-h-8 inline-block" src={Logo} alt="logo_UIT" />
            <text className="inline-block text-sm md:text-lg font-bold">UIT</text>
          </p>
        </Link>
        <ul className="flex gap-4">
          <Link to="/dashboard">
            <li>Dashboard</li>
          </Link>
          <Link to="/">
            <li>Home</li>
          </Link>
          <Link to="/about">
            <li>About</li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.profilePicture}
                alt="profile"
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <li>Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}
