import React, { useState } from "react";

const SpotForm = ({ onSubmit, coords, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description || !category || !coords) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("lat", coords.lat);
    formData.append("lng", coords.lng);

    if (image && image.length > 0) {
      image.forEach((img) => {
        formData.append("images", img);
      });
    }

    onSubmit(formData);

    setTitle("");
    setDescription("");
    setCategory("");
    setImage(null);
  };

  return (
    <div className="card p-6 w-full">
      <h2 className="font-display text-2xl font-bold tracking-tight text-stone-900 mb-4">Add Hidden Spot</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Spot Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-default"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-default"
          rows={4}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-default"
          required
        >
          <option value="">Select Category</option>
          <option value="Nature">Nature</option>
          <option value="Historical">Historical</option>
          <option value="Food">Local Food</option>
          <option value="Spiritual">Spiritual</option>
          <option value="Adventure">Adventure</option>
        </select>

        <div className="text-sm text-stone-600">
          Coordinates: <strong className="text-stone-900">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</strong>
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImage([...e.target.files])}
          className="w-full"
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-full border border-stone-200 text-stone-600 hover:bg-stone-900/5 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SpotForm;
