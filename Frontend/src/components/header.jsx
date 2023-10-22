import Logo from "./logo"

export default function Header() {
    return (
        <div className="grid grid-cols-3">

            <Logo />

            <div className=" flex items-center font-extrabold justify-between px-12">
                <a href="" className="text-indigo-900">How It Works</a>
                <a href="" className="text-indigo-900">Try Now</a>
                <a href="" className="text-indigo-900">Download </a>
            </div>

            <div className="flex items-center justify-end">

                <a href="" className="font-bold text-indigo-900 px-4 py-2 ">Login</a>
                <a href="" className="font-bold bg-indigo-900 text-white px-4 py-2 rounded-xl">Get Started</a>
            </div>

        </div >
    )
}