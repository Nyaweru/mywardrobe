"use client";
import ProtectedLayout from "@/component/ProtectedLayout";
import useAuthGuard from "@/hooks/AuthGuard";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddItem() {
  const router = useRouter();
  const { isReady, token } = useAuthGuard(); 

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    image: null,
  });

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const freshToken = localStorage.getItem("jwtToken"); // get fresh token
  
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("image", form.image);
  
    try {
      const res = await fetch("/api/pgitems", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${freshToken}`, 
        },
        body: formData,
      });
  
      if (!res.ok) {
        const err = await res.text();
        console.error("API error:", err);
        alert("Failed to add item.");
        return;
      }
  
      const data = await res.json();
      console.log("Success:", data);
      router.push("/wardrobe");
    } catch (error) {
      console.error("Submit error:", error);
      alert("Submission failed.");
    }
  };
  const goHome = () => router.push("/wardrobe");

  return (
    <ProtectedLayout>
      <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", backgroundColor: "#eaf7e3" }}>
        <h1 style={{ textAlign: "center", color: "#2e8b57", fontSize: "2rem", marginBottom: "1.5rem" }}>
          Add New Item to My Wardrobe
        </h1>
        <div style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "8px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ color: "#2e8b57", fontSize: "1rem", fontWeight: "bold" }}>
                Name:
                <br />
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  required
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    marginTop: "0.5rem",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "1rem",
                  }}
                />
              </label>
            </div>
  
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ color: "#2e8b57", fontSize: "1rem", fontWeight: "bold" }}>
                Category:
                <br />
                <input
                  type="text"
                  value={form.category}
                  onChange={handleChange("category")}
                  required
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    marginTop: "0.5rem",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "1rem",
                  }}
                />
              </label>
            </div>
  
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ color: "#2e8b57", fontSize: "1rem", fontWeight: "bold" }}>
                Description:
                <br />
                <textarea
                  value={form.description}
                  onChange={handleChange("description")}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    marginTop: "0.5rem",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "1rem",
                    height: "120px",
                  }}
                />
              </label>
            </div>
  
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ color: "#2e8b57", fontSize: "1rem", fontWeight: "bold" }}>
                Upload Image:
                <br />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  style={{
                    marginTop: "0.5rem",
                  }}
                />
              </label>
            </div>
  
            <button
              type="submit"
              style={{
                backgroundColor: "#2e8b57",
                color: "#fff",
                padding: "12px",
                borderRadius: "6px",
                width: "100%",
                fontSize: "1.1rem",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#276d3f")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#2e8b57")}
            >
              Add Item
            </button>
          </form>
  
          <br />
  
          <button
            onClick={goHome}
            style={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              padding: "12px",
              borderRadius: "6px",
              width: "100%",
              fontSize: "1.1rem",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#388e3c")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#4CAF50")}
          >
            Go to Wardrobe
          </button>
        </div>
      </div>
    </ProtectedLayout>
  );
}  