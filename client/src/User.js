import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./User.css";

const URL = "http://localhost:3001/api/user";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [editUserId, setEditUserId] = useState(null);
    const [editUserName, setEditUserName] = useState('');
    const [errors, setErrors] = useState({});

    const fetchUsers = async () => {
        try {
            const response = await axios.get(URL);
            setUsers(response.data);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const validateFields = () => {
        const errors = {};
        if (name.length < 3) errors.name = "Nome deve ter pelo menos 3 caracteres.";
        if (!/^\d{11}$/.test(cpf)) errors.cpf = "CPF deve conter apenas 11 números.";
        if (!/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email) || email.length < 3) errors.email = "Email inválido.";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        try {
            await axios.post(URL, { name, cpf, email });
            setName('');
            setCpf('');
            setEmail('');
            setErrors({});
            fetchUsers();
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`${URL}/${id}`);
            fetchUsers();
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
        }
    };

    const handleEditUser = (user) => {
        setEditUserId(user.id);
        setEditUserName(user.name);
    };

    const handleSaveEditUser = async (e) => {
        e.preventDefault();
        if (editUserName.length < 3) {
            setErrors({ editUserName: "Nome deve ter pelo menos 3 caracteres." });
            return;
        }

        try {
            await axios.put(`${URL}/${editUserId}`, { name: editUserName });
            setEditUserId(null);
            setEditUserName('');
            setErrors({});
            fetchUsers();
        } catch (error) {
            console.error("Erro ao editar usuário:", error);
        }
    };

    return (
        <>
            <h1><span>Prova de SCRIPTS</span> - por Eric Moura</h1>
            <div>
                <h2>Criar Novo Usuário</h2>
                <form onSubmit={handleCreateUser}>
                    <input
                        type="text"
                        placeholder="Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}

                    <input
                        type="text"
                        placeholder="CPF"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        required
                    />
                    {errors.cpf && <p style={{ color: 'red' }}>{errors.cpf}</p>}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

                    <button type="submit">Criar Usuário</button>
                </form>

                <h2>Usuários Cadastrados</h2>
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>
                            {editUserId === user.id ? (
                                <form onSubmit={handleSaveEditUser}>
                                    <input
                                        type="text"
                                        value={editUserName}
                                        onChange={(e) => setEditUserName(e.target.value)}
                                        required
                                    />
                                    {errors.editUserName && <p style={{ color: 'red' }}>{errors.editUserName}</p>}
                                    <button type="submit">Salvar</button>
                                    <button onClick={() => setEditUserId(null)}>Cancelar</button>
                                </form>
                            ) : (
                                <>
                                    <span>{user.name} - CPF: {user.cpf} - Email: {user.email}</span>
                                    <button onClick={() => handleEditUser(user)}>Editar</button>
                                    <button onClick={() => handleDeleteUser(user.id)}>Deletar</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default UserManagement;
