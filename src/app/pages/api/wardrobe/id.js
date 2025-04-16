export default function handler(req, res) {
  const { id } = req.query;

  if (!global.wardrobeItems) {
    global.wardrobeItems = [];
  }

  if (req.method === "GET") {
    const index = global.wardrobeItems.findIndex((item) => item.id === id);
    if (index > -1) {
      res.status(200).json(global.wardrobeItems[index]);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } else if (req.method === "POST") {
    const { name, category, description, imageUrl } = req.body;

    const newItem = {
      id, 
      name,
      category,
      description,
      imageUrl,
    };

    global.wardrobeItems.push(newItem);
    res.status(201).json(newItem);
  } else if (req.method === "PUT") {
    const index = global.wardrobeItems.findIndex((item) => item.id === id);
    if (index > -1) {
      global.wardrobeItems[index] = {
        ...global.wardrobeItems[index],
        ...req.body,
      };
      res.status(200).json(global.wardrobeItems[index]);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } else if (req.method === "DELETE") {
    const index = global.wardrobeItems.findIndex((item) => item.id === id);
    if (index > -1) {
      global.wardrobeItems.splice(index, 1);
      res.status(200).json({ message: "Item deleted" });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  } 
  
}

  
