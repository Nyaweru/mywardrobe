// pages/api/wardrobe/index.js

export default function handler(req, res) {
  if (req.method === "POST") {
    console.log("Received POST request", req.body);
    try {
      const { name, category, description, imageUrl } = req.body;

      if (!global.wardrobeItems) {
        global.wardrobeItems = [];
      }

      const newItem = {
        id: Date.now().toString(),
        name,
        category,
        description,
        imageUrl,
      };

      global.wardrobeItems.push(newItem);
      console.log("New item added", newItem); // 

      res.status(201).json(newItem);
    } catch (error) {
      console.error("Error in POST /api/wardrobe:", error); 
      res.status(500).json({ message: "Failed to add item." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
