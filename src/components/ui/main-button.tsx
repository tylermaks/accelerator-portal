"use client"

export default function MainButton({ 
    id,
    text,
    action,
    altButton = false,
    small = false,
    loading = false
}: { 
    id: string,
    text: string,
    action?: (event: React.MouseEvent<HTMLButtonElement>) => void,
    altButton?: boolean,
    small?: boolean, 
    loading?: boolean
}) {

    const altButtonStyle = altButton ? `border border-orange text-orange hover:bg-orange hover:text-white` : "bg-orange text-white"
    const smallButtonStyle = small ? "p-1.5 text-sm" : "p-2"
    const loadingButtonStyle = loading ? "opacity-50 cursor-not-allowed" : ""
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        action && action(event);
    }

    return (
        <button 
            id={id}
            onClick={handleClick}
            className={`${altButtonStyle} ${smallButtonStyle} ${loadingButtonStyle} rounded-md w-full`}
        >
             {text}
        </button>
    )
}