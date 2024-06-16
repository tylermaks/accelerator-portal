export default function Input({ 
    label,
    type, 
    id,
    name,
    isRequired = false
}: { 
    label: string,
    type: string, 
    id: string,
    name: string
    isRequired?: boolean
}) {
    return (
        <div className="w-full">
            <label htmlFor={id} className="block mb-1 text-xs text-gray-700">
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required={isRequired}
            />
        </div>

    );
}