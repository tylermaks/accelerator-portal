"use client"

export default function MainButton({ 
    text,
    action,
    altButton = false
}: { 
    text: string,
    action?: () => void,
    altButton?: boolean
}) {

    const altButtonStyle = altButton ? "border border-orange text-orange hover:bg-orange hover:text-white" : "bg-orange text-white"

    const handleClick = () => {
        action && action();
    }

    return (
        <button 
            onClick={handleClick}
            type="submit" 
            className={`${altButtonStyle} p-2 rounded-md w-full`}
        >
            {text}
        </button>
    )
}