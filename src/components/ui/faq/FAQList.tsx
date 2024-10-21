type ListProps = { 
    list: string[]
}

export default function FAQList( { list } : ListProps){ 
    return(
        <div className="w-3/4 mx-auto">
            <ul className="list-disc mt-4 flex flex-col gap-3">
                {
                    list.map((listItem, index) => { 
                        return(
                            <li key={index}>
                                {listItem}
                            </li>
                        )
                    })
                }
            </ul>   
        </div>
    )
}