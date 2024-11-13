// ProductList.js
import React, { useState, useEffect, useRef } from "react";
import {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../services/productService";
import ProductForm from "./ProductForm";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const formRef = useRef(null);
    const productRefs = useRef({});

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const data = await getAllProducts();
        setProducts(data);
    };

    const handleSave = async (product) => {
        if (selectedProduct) {
            await updateProduct(selectedProduct.id, product);
            setSuccessMessage("Produto atualizado com sucesso!");
        } else {
            await createProduct(product);
            setSuccessMessage("Produto adicionado com sucesso!");
        }
        setSelectedProduct(null);
        loadProducts();

        setTimeout(() => setSuccessMessage(""), 3000);

        if (selectedProduct) {
            setTimeout(() => {
                if (productRefs.current[selectedProduct.id]) {
                    productRefs.current[selectedProduct.id].scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }, 100);
        } else {
            setTimeout(() => {
                const lastProduct = products[products.length - 1];
                if (lastProduct && productRefs.current[lastProduct.id]) {
                    productRefs.current[lastProduct.id].scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }, 100);
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleCancelEdit = () => {
        setSelectedProduct(null);
    };

    const handleDelete = async (id) => {
        setDeleting(id);
        await deleteProduct(id);
        setDeleting(null);
        loadProducts();
    };

    return (
        <div>
            {successMessage && <p className="success-message">{successMessage}</p>}

            <div ref={formRef} className="form-container">
                <h2>{selectedProduct ? `Editando produto: ${selectedProduct.nome}` : "Adicionar novo produto"}</h2>
                <ProductForm onSave={handleSave} product={selectedProduct} onCancel={handleCancelEdit} />
            </div>

            <section className="list">
                <h2>Lista de Produtos</h2>
                <ul>
                    {products.map((product) => (
                        <li
                            key={product.id}
                            ref={(el) => (productRefs.current[product.id] = el)}
                            className="item"
                        >
                            <p><strong>Nome:</strong> {product.nome}</p>
                            <p><strong>Preço:</strong> R$ {product.preco}</p>
                            <p><strong>Quantidade em Estoque:</strong> {product.quantidadeEmEstoque}</p>
                            <p><strong>Categoria:</strong> {product.categoria || "Não informado."}</p>
                            <div className="button-group">
                                <button onClick={() => handleEdit(product)} className="edit-button">Editar</button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="delete-button"
                                    disabled={deleting === product.id}
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

export default ProductList;
