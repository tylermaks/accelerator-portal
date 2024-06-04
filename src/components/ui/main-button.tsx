export default function MainButton({ 
    text,
}: { 
    text: string,
}) {
    return (
        <button 
            type="submit" 
            className="bg-orange-500 text-white p-2 rounded-md"
        >
            {text}
        </button>
    )
}