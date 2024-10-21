type DetailProps = { 
    title: string,
    id: string,
    children: React.ReactNode
}

export default function FAQDetails( { title, id, children } : DetailProps ){ 
    return(
        <div id={id}>
            <h4>{title}</h4>
            {children}
        </div>
    )
}