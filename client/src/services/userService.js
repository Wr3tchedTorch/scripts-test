import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3001/usuarios",
});

export const getAllUsers = async () => {
    const response = await api.get("/");
    return response.data;
};

export const getUser = async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
};

export const createUser = async (user) => {
    const response = await api.post("/", user);
    return response.data;
};

export const updateUser = async (id, user) => {
    const response = await api.put(`/${id}`, user);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
};
