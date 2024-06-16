export default function Textarea({ label, name }: { label: string, name: string }) {
    return (
        <div className="w-full">
            <label htmlFor="message" className="block mb-1 text-xs text-fsGray ">{label}</label> 
            <textarea 
                className="w-full resize-none border bg-gray-50 rounded-lg p-2 text-sm text-fsGray" 
                name={name} 
                id={name}
                rows={6} 
            /> 
        </div>
    )
}   