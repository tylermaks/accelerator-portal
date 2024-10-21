export default function PageHeader({title, subTitle} : {title: string, subTitle: string}) {
    return(
        <div className="flex flex-col gap-2">
            <h1>{title}</h1> 
            <p>{subTitle}</p>
        </div>
    )
}
