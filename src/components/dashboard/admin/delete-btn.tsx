import { deleteUser } from "@/lib/admin-actions"

interface UserDeleteButtonProps {
    userID: string;
}

export default async function UserDeleteButton({ userID }: UserDeleteButtonProps) {
    return (
        <form action={deleteUser}>
            <input type="text" id="userID" name="userID" className="hidden" defaultValue={userID}/>
            <button className="rounded-md bg-red-500 p-1.5 text-white"> 
                Delete User
            </button>
        </form>
    )
}