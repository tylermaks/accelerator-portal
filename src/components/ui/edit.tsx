import Image from "next/image";

type EditProps = {
    title: string
    save?: boolean
    toggleEdit: () => void
}
export default function Edit({ title, toggleEdit, save=false }: EditProps) {
    return (
        <div
            className="flex items-end gap-1 absolute bottom-0 right-0 cursor-pointer"
            onClick={toggleEdit}
        >
            <Image
                src= "/images/edit-pencil.svg"
                alt="edit"
                width={20}
                height={20}
            />
            <p className="text-fsGray text-xs">{title}</p>
        </div>
    )   
}
