import React, { useState, useEffect } from "react";

const ProductForm = ({ onSave, product, onCancel }) => {
  const [name, setName] = useState(product?.nome || "");
  const [description, setDescription] = useState(product?.descricao || "");
  const [price, setPrice] = useState(product?.preco || "");
  const [stockQuantity, setStockQuantity] = useState(product?.quantidadeEmEstoque || "");
  const [category, setCategory] = useState(product?.categoria || "");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!name) errors.name = "O campo 'nome' é obrigatório.";
    if (!price || isNaN(price) || price <= 0) errors.price = "O campo 'preço' deve ser um número válido maior que 0.";
    if (!stockQuantity || isNaN(stockQuantity) || stockQuantity <= 0) errors.stockQuantity = "O campo 'quantidade em estoque' deve ser um número válido maior que 0.";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      onSave({ nome: name, descricao: description, preco: price, quantidadeEmEstoque: stockQuantity, categoria: category });
      setErrors({}); // Clear errors if submission is successful
      resetForm();
    }
  };

  const handleCancel = () => {
    onCancel();
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setStockQuantity("");
    setCategory("");
  };

  useEffect(() => {
    if (product) {
      setName(product.nome);
      setDescription(product.descricao);
      setPrice(product.preco);
      setStockQuantity(product.quantidadeEmEstoque);
      setCategory(product.categoria);
    }
  }, [product]);

  return (
    <form onSubmit={handleSubmit}>
      <label>Nome:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      {errors.name && <p className="error">{errors.name}</p>}

      <label>Descrição:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>Preço:</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      {errors.price && <p className="error">{errors.price}</p>}

      <label>Quantidade em Estoque:</label>
      <input
        type="number"
        value={stockQuantity}
        onChange={(e) => setStockQuantity(e.target.value)}
        required
      />
      {errors.stockQuantity && <p className="error">{errors.stockQuantity}</p>}

      <label>Categoria:</label>
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <div className="button-group">
        <button type="submit">Salvar</button>
        {product && <button type="button" onClick={handleCancel}>Cancelar</button>}
      </div>
    </form>
  );
};

export default ProductForm;
