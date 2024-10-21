type SectionProps = { 
    title: string,
    id: string, 
    children: React.ReactNode
}

export default function FAQSection({ title, id, children } : SectionProps) { 
    return( 
        <section className="mb-12" id={id}>
            <h2 className="text-teal">{title}</h2>
            {children}
        </section>
    )
}