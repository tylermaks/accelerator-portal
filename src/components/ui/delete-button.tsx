type ButtonProps =  { 
    id: string,
    text: string,
    action?: (event: React.MouseEvent<HTMLButtonElement>) => void,
    loading?: boolean
    width?: string
}

export default function DeleteButton({ id, text, action, loading, width } : ButtonProps ) { 
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        action && action(event);
    }

    return (
        <button 
            id={id}
            onClick={handleClick}
            className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-md w-full p-2"
        >
             {text}
        </button>
    )
}