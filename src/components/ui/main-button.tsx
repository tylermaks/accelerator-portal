type MainButtonProps =  { 
    id: string,
    text: string,
    action?: (event: React.MouseEvent<HTMLButtonElement>) => void, 
    loading?: boolean
    small?: boolean
    type?: "button" | "submit" | "reset"
}


export default function MainButton({ 
    text,
    id,
    action,
    loading,
    small,
    type

} : MainButtonProps ) {
    const loadingButtonStyle = loading ? "opacity-50 cursor-not-allowed" : ""
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        action && action(event);
    }

    return (
        <button 
            id={id}
            type={type || "button"}
            onClick={handleClick}
            className={`${loadingButtonStyle} ${small ? "p-1" : "p-2"} bg-orange text-white p-2 w-full rounded-md `}
        >
             {text}
        </button>
    )
}