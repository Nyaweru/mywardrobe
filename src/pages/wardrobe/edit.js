
'use client';

import { useState } from "react";
import { useRouter } from "next/router";

export default function EditItemForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "",
    description: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/pgitems`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server returned:", errorText);
        throw new Error("Failed to update item");
      }

      const data = await res.json();
      console.log("Item updated:", data);
      router.push("/pages/wardrobe"); 
    } catch (err) {
      alert("Failed to update item. Check console.");
    }
  };

  const handleDelete = async () => {
    if (!form.id) {
      alert("ID is required to delete an item.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/pgitems`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: form.id }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server returned:", errorText);
        alert("Failed to delete item");
        return;
      }

      const data = await res.json();
      alert("Item deleted successfully");
      console.log("Deleted:", data);

      setForm({
        id: "",
        name: "",
        category: "",
        description: "",
        imageUrl: "",
      });

      router.push("/pages/wardrobe");
    } catch (err) {
      alert("Failed to delete item. Check console.");
    }
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "2rem auto",
      padding: "2rem",
      backgroundColor: "#f9f9f9",
      border: "1px solid #ddd",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.05)"
    }}>
      <h1 style={{
        textAlign: "center",
        color: "#2c3e50",
        marginBottom: "1.5rem"
      }}>
        Edit Wardrobe Item
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        {["id", "name", "category", "imageUrl"].map((field) => (
          <div key={field}>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#555" }}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
                fontSize: "1rem"
              }}
            />
          </div>
        ))}

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "#555" }}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "1rem"
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Update Item
        </button>
        <button
          type="button"
          onClick={handleDelete}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Delete Item
        </button>
      </form>
    </div>
  );
}
