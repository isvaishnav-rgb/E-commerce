import { Link } from "react-router-dom";

const Logo = ({text}: {text: string}) => {
    const handleClick = () => {
        window.scrollTo({top: 0, behavior: "smooth"})
    }
    return (
        <>
          <Link
            to="/"
            className={`${text} cursor-pointer font-extrabold tracking-tight text-indigo-600`}
            onClick={handleClick}
          >
            Apna<span className="text-gray-900">Mart</span>
          </Link>
        </>
    )
}

export default Logo;