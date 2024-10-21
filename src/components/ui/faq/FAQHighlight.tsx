type HighlightProps = { 
    children: React.ReactNode, 
}


export default function FAQHighlight({ children } : HighlightProps ) { 
    return (
        <p className="w-full my-6 mx-auto p-2 bg-green-100 rounded-md flex flex-col gap-4 border border-green-500 text-center">
            <span className="font-bold">Please note:</span>
            {children}
        </p>
    )
}
