export default function MainButton({ 
    text,
    action
}: { 
    text: string,
    action?: () => void | undefined
}) {
    return (
        <button 
            type="submit" 
            className="bg-orange-500 text-white p-2 rounded-md"
            formAction={action}
        >
            {text}
        </button>
    )
}