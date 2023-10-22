import React from "react"
import handsign1 from "../images/handsign1.png"
import handsign2 from "../images/handsign2.png"

export default function S3() {
    return (
        <div>
            <div className="text-center grid grid-cols-4 gap-4">
                <div className="col-span-1"></div>
                <div className="col-span-2">
                    <p className="text-4xl font-bold my-2"> Our Product </p>
                    <p className="text-xl font-light">
                        Generative Visual Language is designed to enhance the video call experience for people with sensory impairment. Our software translates speech to text and generates context-relevant images to ensure all participants in the call can understand the conversation.
                    </p>
                </div>
                <div className="col-span-1"></div>
            </div>

            <div className="grid grid-cols-2 my-12">
                <div className="bg-blue-200 rounded-xl mx-12 py-4">
                    <div className="grid grid-cols-2 items-center">

                        <div className="text-center">
                            <img src={handsign1} alt="" className="rounded-xl mx-auto w-1/3" />
                        </div>

                        <div className="text-center">
                            <span className='font-bold text-lg'>ASL ⇔ Text ⇔ Speech</span>
                            <br />
                            <span className="font-semibold text-md">Accurate Translations</span>
                        </div>

                        <div></div>
                    </div>
                    <div className="text-center px-16 mt-8">
                        Our ASL ⇔ Text ⇔ Speech AI accurately transcribes spoken ASL into text to our AI speech assistants , ensuring that all participants can follow the conversation.
                        <br />
                        <br />
                        Users with various impairments can choose the form of translation they want and get it real-time.
                    </div>
                </div>

                <div className="bg-blue-200 rounded-xl mx-12 py-4">
                    <div className="grid grid-cols-2 items-center">

                        <div className="text-center">
                            <span className='font-bold text-lg'>Generative Image Pipeline</span>
                            <br />
                            <span className="font-semibold text-md">Accurate Translations</span>
                        </div>

                        <div className="text-center">
                            <img src={handsign2} alt="" className="rounded-xl mx-auto w-1/2" />
                        </div>



                        <div></div>
                    </div>
                    <div className="text-center px-16 mt-8">
                        Our generative image pipeline generates context-relevant images to provide additional visual cues to hearing-impaired participants and enhance their understanding of the conversation.
                        <br />
                        Users with visual impairments can choose to convert on-screen text to speech during a meeting.
                    </div>
                </div>
            </div>
        </div>
    );
}
