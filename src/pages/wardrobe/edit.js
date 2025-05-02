
'use client';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditItemForm() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const token = localStorage.getItem("jwtToken");
    
      try {
        const res = await fetch(`/api/pgitems?id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!res.ok) throw new Error(`Failed to fetch item, status: ${res.status}`);
        const data = await res.json();
    
        setForm({
          id: data.id,
          name: data.name,
          category: data.category,
          description: data.description || "",
          image: data.image_path || "",
        });
      } catch (err) {
        console.error("Error fetching item:", err);
        alert("Error fetching item.");
      }
    };
    
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, imageFile: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    try {
      const res = await fetch(`/api/pgitems?id=${form.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          description: form.description,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server returned:", errorText);
        throw new Error("Failed to update item");
      }

      const data = await res.json();
      console.log("Item updated:", data);
      router.push("/wardrobe");
    } catch (err) {
      alert("Failed to update item. Check console.");
    }
  };
  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;
  
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }
  
    try {
      const res = await fetch(`/api/pgitems?id=${form.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server returned:", errorText);
        alert("Failed to delete item.");
        return;
      }
  
      alert("Item deleted successfully.");
      router.push("/wardrobe");
    } catch (err) {
      console.error("Delete error:", err.message);
      alert("Error deleting item. Check console.");
    }
  };
  
  
  
  if (!form.id && id) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading item...</p>;
  }

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
      <h1 style={{ textAlign: "center", color: "#2c3e50", marginBottom: "1.5rem" }}>
        Edit Wardrobe Item
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        {["id", "name", "category"].map((field) => (
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
              disabled={field === "id"}
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

        {form.image && (
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#555" }}>Current Image</label>
            <img
              src={`data:image/png;base64,${form.image}`}
              alt="Item"
              style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "6px", marginBottom: "1rem" }}
            />
          </div>
        )}

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", color: "#555" }}>Upload New Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>

        <button type="submit" style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: "pointer"
        }}>
          Update Item
        </button>

        <button type="button" onClick={handleDelete} style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#e74c3c",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: "pointer"
        }}>
          Delete Item
        </button>
      </form>
    </div>
  );
}
