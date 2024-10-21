type SubSectionProps = { 
    title: string
    id: string,
    children: React.ReactNode,
}

export default function FAQSubSection ({ title, id, children } : SubSectionProps){ 
    return(
        <div id={id} className="mb-12">
            <h3 className="font-bold">{title}</h3> 
            <div className="flex flex-col gap-8">
                {children}  
            </div>   
        </div>
    )
}