import React, { useState, useEffect, useRef } from "react";
import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
} from "../services/userService";
import UserForm from "./UserForm";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const formRef = useRef(null);
    const userRefs = useRef({});

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const data = await getAllUsers();
        setUsers(data);
    };

    const handleSave = async (user) => {
        if (selectedUser) {
            await updateUser(selectedUser.id, user);
            setSuccessMessage("Usuário atualizado com sucesso!");
        } else {
            await createUser(user);
            setSuccessMessage("Usuário adicionado com sucesso!");
        }
        setSelectedUser(null);
        loadUsers();

        setTimeout(() => setSuccessMessage(""), 3000);

        if (selectedUser) {
            setTimeout(() => {
                if (userRefs.current[selectedUser.id]) {
                    userRefs.current[selectedUser.id].scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }, 100);
        } else {
            setTimeout(() => {
                const lastUser = users[users.length - 1];
                if (lastUser && userRefs.current[lastUser.id]) {
                    userRefs.current[lastUser.id].scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }, 100);
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleCancelEdit = () => {
        setSelectedUser(null);
    };

    const handleDelete = async (id) => {
        setDeleting(id);
        await deleteUser(id);
        setDeleting(null);
        loadUsers();
    };

    return (
        <div>
            {successMessage && <p className="success-message">{successMessage}</p>}

            <div ref={formRef} className="form-container">
                <h2>{selectedUser ? `Editando usuário: ${selectedUser.nome}` : "Adicionar novo usuário"}</h2>
                <UserForm onSave={handleSave} user={selectedUser} onCancel={handleCancelEdit} users={users} />
            </div>

            <section className="list">
                <h2>Lista de Usuários</h2>
                <ul>
                    {users.map((user) => (
                        <li
                            key={user.id}
                            ref={(el) => (userRefs.current[user.id] = el)}
                            className="item"
                        >
                            <p><strong>Nome:</strong> {user.nome}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Data de Nascimento:</strong> {user.dataNascimento}</p>
                            <p><strong>Telefone:</strong> {user.telefone || "Não informado"}</p>
                            <div className="button-group">
                                <button onClick={() => handleEdit(user)} className="edit-button">Editar</button>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="delete-button"
                                    disabled={deleting === user.id}
                                >
                                    Excluir
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default UserList;
