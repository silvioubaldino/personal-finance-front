'use client';

import React, { useState } from 'react';
import AddButton from '@/app/shared/components/add/ui/AddButton';
import Modal from "@/app/shared/components/add/ui/modal";
import Form from "@/app/shared/components/add/ui/form";

const ClientOnlyModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <AddButton onClick={openModal} />
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <Form />
            </Modal>
        </>
    );
};

export default ClientOnlyModal;