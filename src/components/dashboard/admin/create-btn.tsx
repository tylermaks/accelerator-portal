'use client'

import Modal from '@/components/ui/modal'
import CreateUserForm from './create-user-form'
import { useState } from 'react'

export default function CreateNewUser() { 
    const [modal, setModal] = useState(false)

    const toggleModal = () => { 
        setModal(!modal)
    }
    

    return ( 
        <div className='w-full flex justify-end py-4'>
            { modal &&
                <Modal title="Create new user" action={toggleModal} subtitle="">
                    <CreateUserForm toggleModal={toggleModal}/>
                </Modal>
            }
            
            <button id="user-modal-btn" onClick={toggleModal} className="rounded-md text-white text-sm bg-orange p-1.5"> Create New User </button>
        </div>
    )
}