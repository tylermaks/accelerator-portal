type AltButtonProps =  { 
    id: string,
    text: string,
    action?: (event: React.MouseEvent<HTMLButtonElement>) => void,
    loading?: boolean
    width?: string
}

export default function AltButton({ id, text, action, loading, width } : AltButtonProps) {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        action && action(event);
    }

    return (
        <button 
            id={id}
            onClick={handleClick}
            className="border border-orange text-orange hover:bg-orange hover:text-white rounded-md w-full p-2"
        >
             {text}
        </button>
    )
}