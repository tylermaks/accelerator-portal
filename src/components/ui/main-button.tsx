type MainButtonProps =  { 
    id: string,
    text: string,
    action?: (event: React.MouseEvent<HTMLButtonElement>) => void,
    altButton?: boolean,
    warning?: boolean,
    small?: boolean, 
    loading?: boolean
    width?: string
}


export default function MainButton({ id, text, action, altButton = false, warning = false, small = false, loading = false, width} : MainButtonProps ) {
    const warningButtonStyle = warning ? "red-500" : "orange"
    const altButtonStyle = altButton ? `border border-${warningButtonStyle} text-${warningButtonStyle} hover:bg-${warningButtonStyle}` : "bg-orange text-white"
    const smallButtonStyle = small ? "p-1.5 text-sm" : "p-2"
    const loadingButtonStyle = loading ? "opacity-50 cursor-not-allowed" : ""
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        action && action(event);
    }

    return (
        <button 
            id={id}
            onClick={handleClick}
            className={`${altButtonStyle} ${smallButtonStyle} ${loadingButtonStyle} rounded-md ${width ? width : 'w-full'}`}
        >
             {text}
        </button>
    )
}