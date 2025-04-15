// pages/wardrobe/edit/[id].js

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function EditItem() {
  const router = useRouter();
  const { id } = router.query; // Fetching the item ID from the URL
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    imageUrl: "",
  });

  // Fetch the item data when the component mounts
  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        const res = await fetch(`/api/items/${id}`); // Fetch item by ID
        if (res.ok) {
          const data = await res.json();
          setForm(data); // Set the fetched data into the form state
        } else {
          console.error("Failed to fetch item");
        }
      };
      fetchItem();
    }
  }, [id]); // Re-run when the id changes (if it does)

  const handleSubmit = async (e) => {
    e.preventDefault();

    // PUT request to update the item
    const res = await fetch(`/api/items/${id}`, {
      method: "PUT", // Method to update the item
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...form }), // Sending the updated form data with the ID
    });

    if (res.ok) {
      router.push("/wardrobe"); // Redirect to the wardrobe page after successful update
    } else {
      const data = await res.json();
      alert(data.error || "Failed to update item.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Edit Wardrobe Item</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <br />
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
        </div>
        <br />
        <div>
          <label>
            Category:
            <br />
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
          </label>
        </div>
        <br />
        <div>
          <label>
            Description:
            <br />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
        </div>
        <br />
        <div>
          <label>
            Image URL:
            <br />
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </label>
        </div>
        <br />
        <button type="submit">Update Item</button>
      </form>
    </div>
  );
}
