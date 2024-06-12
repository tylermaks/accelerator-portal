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
        <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-50 absolute top-0 left-0 z-50">
            <div className="w-2/5 bg-gray-50 p-6 rounded-xl">
                <div className="relative mb-6">
                    <h2 className="text-xl font-bold text-fsGray mb-1">{title}</h2>
                    <p className="text-sm text-fsGray">{subtitle}</p>
                    <Image 
                        src="/images/close-icon.svg"
                        alt="Close Icon"
                        width={12}
                        height={12}
                        className="absolute top-1 right-1 cursor-pointer"
                    />
                </div>
                {children}
            </div>
        </div>
    )
}