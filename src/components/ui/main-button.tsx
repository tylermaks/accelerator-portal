export default function MainButton({ 
    text,
    action,
    altButton = false
}: { 
    text: string,
    action?: () => void | undefined
    altButton?: boolean
}) {

    const altButtonStyle = altButton ? "border border-orange text-orange hover:bg-orange hover:text-white" : "bg-orange text-white"

    return (
        <button 
            type="submit" 
            className={`${altButtonStyle} p-2 rounded-md w-full`}
            formAction={action}
        >
            {text}
        </button>
    )
}