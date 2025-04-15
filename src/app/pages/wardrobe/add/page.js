'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddItem() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    imageUrl: "",
  });

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      name: form.name,
      category: form.category,
      description: form.description,
      imageUrl: form.imageUrl,
    };

    console.log("Submitting:", submissionData);

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        body: JSON.stringify(submissionData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const body = await res.text();

      if (!res.ok) {
        console.error("API error:", body);
        alert("Failed to add item. Please try again.");
        return;
      }

      try {
        const responseData = JSON.parse(body);
        console.log("Success:", responseData);
        router.push("/pages/wardrobe"); // Redirect after success
      } catch (err) {
        console.error("JSON parse error:", err);
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item. Please try again.");
    }
  };

  const goHome = () => {
    router.push("/pages/wardrobe");
  };
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", backgroundColor: "#eaf7e3" }}>
      <h1 style={{ textAlign: "center", color: "#2e8b57" }}>Add New Wardrobe Item</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={{ color: "#2e8b57" }}>
            Name:<br />
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              required
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "2px solid #2e8b57",
                width: "100%",
                margin: "8px 0",
                backgroundColor: "#f9f9f9",
              }}
            />
          </label>
        </div>
        <br />
        <div>
          <label style={{ color: "#2e8b57" }}>
            Category:<br />
            <input
              type="text"
              value={form.category}
              onChange={handleChange("category")}
              required
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "2px solid #2e8b57",
                width: "100%",
                margin: "8px 0",
                backgroundColor: "#f9f9f9",
              }}
            />
          </label>
        </div>
        <br />
        <div>
          <label style={{ color: "#2e8b57" }}>
            Description:<br />
            <textarea
              value={form.description}
              onChange={handleChange("description")}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "2px solid #2e8b57",
                width: "100%",
                margin: "8px 0",
                backgroundColor: "#f9f9f9",
              }}
            />
          </label>
        </div>
        <br />
        <div>
          <label style={{ color: "#2e8b57" }}>
            Image URL:<br />
            <input
              type="text"
              value={form.imageUrl}
              onChange={handleChange("imageUrl")}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "2px solid #2e8b57",
                width: "100%",
                margin: "8px 0",
                backgroundColor: "#f9f9f9",
              }}
            />
          </label>
        </div>
        <br />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#2e8b57",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            width: "100%",
            marginTop: "12px",
          }}
        >
          Add Item
        </button>
      </form>

      <br />

      {/* Home Button */}
      <button
        onClick={goHome}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
          width: "100%",
        }}
      >
        Go to Wardrobe
      </button>
    </div>
  );
}

