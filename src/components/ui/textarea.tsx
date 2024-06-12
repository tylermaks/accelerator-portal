export default function Textarea({ label }: { label: string }) {
    return (
        <div className="w-full">
            <label htmlFor="message" className="block mb-1 text-xs text-fsGray">{label}</label> 
            <textarea className="w-full resize-none border bg-gray-50 rounded p-2 text-sm text-fsGray" name="message" id="message" rows={5} /> 
        </div>
    )
}   