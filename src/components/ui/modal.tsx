import Image from "next/image"
interface ModalProps {
    title: string
    subtitle: string
    children: React.ReactNode
}

export default function Modal(
    {title, subtitle, children} : ModalProps
) {
    return(
        <div className="flex items-center justify-center w-full h-full  absolute top-0 left-0 z-50">
            <div className=" w-2/5 shadow-2xl bg-gray-50 absolute right-0 top-0 bottom-0">
                <div className="flex justify-between items-center px-6 py-8 mb-6 bg-gradient-to-r from-teal-md to-teal-lt text-gray-50">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <Image 
                        src="/images/close-icon.svg"
                        alt="Close Icon"
                        width={20}
                        height={20}
                        className="cursor-pointer filter invert"
                    />
                </div>
                <div className="px-6">
                    {children}
                </div>
            </div>
        </div>
    )
}