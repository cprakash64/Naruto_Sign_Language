

export default function Header() {
    return (
        <div className="grid grid-cols-3">

            <div className="text-3xl font-bold tracking-tight flex align-center">
                < svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 mr-2 text-indigo-900" >
                    <path d="M10.5 1.875a1.125 1.125 0 012.25 0v8.219c.517.162 1.02.382 1.5.659V3.375a1.125 1.125 0 012.25 0v10.937a4.505 4.505 0 00-3.25 2.373 8.963 8.963 0 014-.935A.75.75 0 0018 15v-2.266a3.368 3.368 0 01.988-2.37 1.125 1.125 0 011.591 1.59 1.118 1.118 0 00-.329.79v3.006h-.005a6 6 0 01-1.752 4.007l-1.736 1.736a6 6 0 01-4.242 1.757H10.5a7.5 7.5 0 01-7.5-7.5V6.375a1.125 1.125 0 012.25 0v5.519c.46-.452.965-.832 1.5-1.141V3.375a1.125 1.125 0 012.25 0v6.526c.495-.1.997-.151 1.5-.151V1.875z" />
                </svg >

                <span className="text-indigo-900">Echo</span>
                <span className="text-gray-500">Sign</span>
            </div >

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