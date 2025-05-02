"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
        const token = localStorage.getItem("jwtToken");
  
        const res = await fetch("/api/pgitems", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await res.json();
  
        if (res.ok) {
          setItems(data);
        } else {
          console.error("Fetch error:", data.error);
          setError(data.error || "Failed to load items");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false); 
      }
    };
  
    fetchItems();
  }, []);
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;
  
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }
  
    try {
      const res = await fetch(`/api/pgitems?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Check status code directly 
      if (res.status === 204 || res.status === 200) {
        alert("Item deleted successfully.");
  
      } else {
        const errorText = await res.text();
        console.error("Server returned:", errorText);
        alert("Failed to delete item.");
      }
    } catch (err) {
      console.error("Delete error:", err.message);
      alert("Error deleting item. Check console.");
    }
  };
  
  const router = useRouter();
const handleLogout = () => {
  // Clear any auth tokens from localStorage 
  localStorage.removeItem("token"); 
  // Then redirect
  router.push("/login");
};

  const BASE_URL = "http://localhost:3000/";
const renderItem = (item) => (
    <div
      key={item.id}
      style={{
        backgroundColor: "fff",
        
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 8px 16px hsla(0, 10.10%, 78.60%, 0.20)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
      }}
  
    >
      {item.image_path && (
  <img
    src={`${BASE_URL}${item.image_path}`}  
    alt={item.name}
    style={{
      width: "100%",
      height: "150px",
      objectFit: "cover",
      borderRadius: "8px",
      marginBottom: "1rem",
    }}
  />
)}
      <h3 style={{ color: "#333", marginBottom: "0.5rem" }}>{item.name}</h3>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "0.5rem" }}>
        <strong>Category:</strong> {item.category}
      </p>
      <p style={{ color: "#555", fontSize: "14px", flexGrow: 1 }}>{item.description}</p>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
        <Link
          href={`/wardrobe/edit?id=${item.id}`}
          style={{
            backgroundColor: "#0070f3",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            fontWeight: "bold",
            textDecoration: "none",
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
            borderRadius: "6px",
            padding: "0.5rem 1rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#e53935")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#f44336")}
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", backgroundColor: "#f8f8f8" }}>
      <h1 style={{ textAlign: "center", color: "#2e8b57", fontSize: "30px" }}>Welcome to Your Wardrobe</h1>
      <p style={{ textAlign: "center", maxWidth: "600px", margin: "auto", color: "#555" }}>
        This is your personal wardrobe management system. Below you'll find your current wardrobe items.
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
        <Link
          href="/wardrobe/add"
          style={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            textAlign: "center",
            fontWeight: "bold",
            padding: "0.75rem 1.5rem",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          Add New Item
        </Link>

        <button
          onClick={() => setArrangedView(!arrangedView)}
          style={{
            backgroundColor: "#0070f3",
            color: "#fff",
            borderRadius: "8px",
            border: "none",
            fontWeight: "bold",
            padding: "0.75rem 1.5rem",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {arrangedView ? "View All" : "Arrange by Category"}
        </button>
        <button
        onClick={handleLogout}
        style={{
          backgroundColor: "#e53935",
          color: "#fff",
          borderRadius: "8px",
          border: "none",
          fontWeight: "bold",
          padding: "0.75rem 1.5rem",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        Logout
      </button>
      </div>

      <h2 style={{ color: "#333", textAlign: "center", marginTop: "2rem" }}>Wardrobe Items</h2>

      {loading ? (
        <p style={{ textAlign: "center", color: "#888" }}>Loading items...</p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : items.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>
          No items found. Add a new wardrobe item to get started!
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            marginTop: "2rem",
          }}
        >
          {arrangedView
            ? Object.entries(groupedItems).map(([category, group]) => (
                <div key={category}>
                  <h3 style={{ color: "#2e8b57", borderBottom: "1px solid #ccc", marginBottom: "1rem" }}>{category}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
                    {group.map((item) => renderItem(item))}
                  </div>
                </div>
              ))
            : items.map((item) => renderItem(item))}
        </div>
        
      )}
    </div>
  );
}
