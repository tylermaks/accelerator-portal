type MainButtonProps =  { 
    id: string,
    text: string,
    action?: (event: React.MouseEvent<HTMLButtonElement>) => void, 
    loading?: boolean
    small?: boolean
    width?: string
}


export default function MainButton({ id, text, action, loading = false, small, width} : MainButtonProps ) {
    const loadingButtonStyle = loading ? "opacity-50 cursor-not-allowed" : ""
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        action && action(event);
    }

    return (
        <button 
            id={id}
            onClick={handleClick}
            className={`${loadingButtonStyle} ${small ? "p-1" : "p-2"} bg-orange text-white p-2 w-full rounded-md `}
        >
             {text}
        </button>
    )
}