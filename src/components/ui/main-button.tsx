type MainButtonProps =  { 
    id: string,
    text: string,
    action?: (event: React.MouseEvent<HTMLButtonElement>) => void, 
    loading?: boolean
    width?: string
}


export default function MainButton({ id, text, action, loading = false, width} : MainButtonProps ) {
    const loadingButtonStyle = loading ? "opacity-50 cursor-not-allowed" : ""
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        action && action(event);
    }

    return (
        <button 
            id={id}
            onClick={handleClick}
            className={`${loadingButtonStyle} bg-orange text-white w-full p-2 rounded-md `}
        >
             {text}
        </button>
    )
}