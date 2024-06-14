"use client"

export default function MainButton({ 
    text,
    action,
    altButton = false,
    small = false,
    loading = false
}: { 
    text: string,
    action?: () => void,
    altButton?: boolean,
    small?: boolean, 
    loading?: boolean
}) {

    const altButtonStyle = altButton ? `border border-orange text-orange hover:bg-orange hover:text-white` : "bg-orange text-white"
    const smallButtonStyle = small ? "p-1.5 text-sm" : "p-2"
    const loadingButtonStyle = loading ? "opacity-50 cursor-not-allowed" : ""
    const handleClick = () => {
        action && action();
    }

    return (
        <button 
            onClick={handleClick}
            className={`${altButtonStyle} ${smallButtonStyle} ${loadingButtonStyle} rounded-md w-full`}
        >
             {text}
        </button>
    )
}