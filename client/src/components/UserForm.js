import React, { useState, useEffect } from "react";

const UserForm = ({ onSave, user, onCancel, users }) => {
    const [nome, setNome] = useState(user?.nome || "");
    const [email, setEmail] = useState(user?.email || "");
    const [dataNascimento, setDataNascimento] = useState(user?.dataNascimento || "");
    const [telefone, setTelefone] = useState(user?.telefone || "");
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const errors = {};

        // Validação de nome
        if (!nome) errors.nome = "O campo 'nome' é obrigatório.";

        // Validação de email
        if (!email) {
            errors.email = "O campo 'email' é obrigatório.";
        } else {
            // Verificando se o email é único
            const emailExists = users.some(
                (user) => user.email === email && user.id !== user?.id
            );
            if (emailExists) {
                errors.email = "Este email já está em uso.";
            }
        }

        // Validação de data de nascimento
        if (!dataNascimento) errors.dataNascimento = "O campo 'data de nascimento' é obrigatório.";

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        } else {
            onSave({ nome, email, dataNascimento, telefone });
            setErrors({});
            resetForm();
        }
    };

    const handleCancel = () => {
        onCancel();
        resetForm();
    };

    const resetForm = () => {
        setNome("");
        setEmail("");
        setDataNascimento("");
        setTelefone("");
    };

    useEffect(() => {
        if (user) {
            setNome(user.nome);
            setEmail(user.email);
            setDataNascimento(user.dataNascimento);
            setTelefone(user.telefone);
        }
    }, [user]);

    return (
        <form onSubmit={handleSubmit}>
            <label>Nome:</label>
            <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
            />
            {errors.nome && <p className="error">{errors.nome}</p>}

            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            {errors.email && <p className="error">{errors.email}</p>}

            <label>Data de Nascimento:</label>
            <input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
            />
            {errors.dataNascimento && <p className="error">{errors.dataNascimento}</p>}

            <label>Telefone:</label>
            <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
            />

            <div className="button-group">
                <button type="submit">Salvar</button>
                {user && <button type="button" onClick={handleCancel}>Cancelar</button>}
            </div>
        </form>
    );
};

export default UserForm;
