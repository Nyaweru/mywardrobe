"use client";


import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [arrangedView, setArrangedView] = useState(false);

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/pgitems");
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        setItems(data);
      } catch (error) {
        setError("Could not fetch items, please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/pgitems`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const text = await res.text();
      console.log("Delete response:", text);

      if (!res.ok) throw new Error("Failed to delete item");

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Error deleting item, please try again.");
    }
  };

  const renderItem = (item) => (
    <li
      key={item.id}
      style={{
        margin: "1rem 0",
        padding: "1.5rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3 style={{ color: "#333" }}>{item.name}</h3>
      <p style={{ color: "#666", fontSize: "14px" }}>
        <strong>Category:</strong> {item.category}
      </p>
      <p style={{ color: "#555" }}>{item.description}</p>
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          width="150"
          style={{
            marginBottom: "1rem",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link
          href={`/wardrobe/edit?id=${item.id}`}
          style={{
            color: "#0070f3",
            textDecoration: "none",
            fontWeight: "bold",
            marginRight: "1rem",
          }}
        >
          Edit
        </Link>
        <button
          onClick={() => handleDelete(item.id)}
          style={{
            backgroundColor: "#f44336",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#e53935")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#f44336")}
        >
          Delete
        </button>
      </div>
    </li>
  );

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", backgroundColor: "#f8f8f8" }}>
      <h1 style={{ textAlign: "center", color: "#2e8b57", fontSize:"30px" }}>Welcome to Your Wardrobe</h1>
      <p style={{ textAlign: "center", maxWidth: "600px", margin: "auto", color: "#555" }}>
        This is your personal wardrobe management system. Below you'll find your current wardrobe items.
      </p>

      <Link
        href="/pages/wardrobe/add"
        style={{
          display: "inline-block",
          margin: "1rem auto",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#4CAF50",
          color: "#fff",
          borderRadius: "8px",
          textDecoration: "none",
          textAlign: "center",
          fontWeight: "bold",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        Add New Item
      </Link>

      <button
        onClick={() => setArrangedView(!arrangedView)}
        style={{
          margin: "1rem auto",
          display: "block",
          padding: "0.5rem 1rem",
          backgroundColor: "#0070f3",
          color: "#fff",
          borderRadius: "6px",
          fontWeight: "bold",
          border: "none",
          cursor: "pointer",
        }}
      >
        {arrangedView ? "View All" : "Arrange by Category"}
      </button>

      <h2 style={{ color: "#333", textAlign: "center" }}>Wardrobe Items</h2>

      {loading ? (
        <p style={{ textAlign: "center", color: "#888" }}>Loading items...</p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : items.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>
          No items found. Add a new wardrobe item to get started!
        </p>
      ) : arrangedView ? (
        Object.entries(groupedItems).map(([category, group]) => (
          <div key={category} style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#2e8b57", borderBottom: "1px solid #ccc" }}>{category}</h3>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {group.map((item) => renderItem(item))}
            </ul>
          </div>
        ))
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {items.map((item) => renderItem(item))}
        </ul>
      )}
    </div>
  );
}
