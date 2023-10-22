import Logo from "./logo"

export default function S2() {
    return (
        <div className=" text-center grid grid-cols-3 gap-3 my-10 mx-3 ">
            <div className="col-span-1">
                <img
                    src="https://www.chsc.org/images/uploads/services/Zoom_Training.jpg"
                    alt=""
                    className="rounded-xl mx-auto "
                />
            </div>
            <div className="col-span-2">
                <div className="flex justify-center">
                    <Logo color1="text-indigo-900" color2="text-indigo-900" className="text-2xl" />
                </div>

                <p className="m-12 p-4 text-xl font-medium bg-indigo-900 text-white rounded-xl leading-relaxed">
                    Generative Visual Language is a new upcoming software product that will revolutionize how people with hearing impairment attend video calls. Our product translates between speech, text and image for all viewers in a meeting to understand. Our mission is to provide equal access and participation in video calls for all individuals.
                </p>






            </div >


        </div>
    )
}