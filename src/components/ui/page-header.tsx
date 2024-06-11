export default function PageHeader({title, subTitle} : {title: string, subTitle: string}) {
    return(
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-fsGray">{title}</h1> 
            <p className="text-fsGray">{subTitle}</p>
        </div>
    )
}
