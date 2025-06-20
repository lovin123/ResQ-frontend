import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"; // Backend URL from .env

function App() {
  const [disasters, setDisasters] = useState([]);
  const [form, setForm] = useState({
    title: "",
    location_name: "",
    description: "",
    tags: "",
  });
  const [selected, setSelected] = useState(null);
  const [report, setReport] = useState({ content: "", image_url: "" });
  const [social, setSocial] = useState([]);
  const [resources, setResources] = useState([]);
  const [verifyResult, setVerifyResult] = useState("");

  useEffect(() => {
    fetchDisasters();
    const socket = io(API_BASE);
    socket.on("disaster_updated", fetchDisasters);
    socket.on("social_media_updated", (d) => setSocial(d.posts));
    socket.on("resources_updated", (d) => setResources(d.resources));
    return () => socket.disconnect();
  }, []);

  async function fetchDisasters() {
    const res = await axios.get(`${API_BASE}/disasters`);
    setDisasters(res.data);
  }

  async function createDisaster(e) {
    e.preventDefault();
    const tags = form.tags.split(",").map((t) => t.trim());
    await axios.post(`${API_BASE}/disasters`, { ...form, tags });
    setForm({ title: "", location_name: "", description: "", tags: "" });
    fetchDisasters();
  }

  async function selectDisaster(d) {
    setSelected(d);
    // Fetch social media
    const res = await axios.get(`${API_BASE}/disasters/${d.id}/social-media`);
    setSocial(res.data.posts);
    // Fetch resources (use disaster location if available)
    if (d.location) {
      const [lng, lat] = d.location.coordinates;
      const r = await axios.get(
        `${API_BASE}/disasters/${d.id}/resources?lat=${lat}&lon=${lng}`
      );
      setResources(r.data);
    } else {
      setResources([]);
    }
  }

  async function submitReport(e) {
    e.preventDefault();
    // Not implemented: POST to /reports
    setReport({ content: "", image_url: "" });
  }

  async function verifyImage() {
    if (!selected || !report.image_url) return;
    const res = await axios.post(
      `${API_BASE}/disasters/${selected.id}/verify-image`,
      { image_url: report.image_url }
    );
    setVerifyResult(res.data.result);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Disaster Response Dashboard</h2>
      <form onSubmit={createDisaster} style={{ marginBottom: 20 }}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        <input
          placeholder="Location Name"
          value={form.location_name}
          onChange={(e) =>
            setForm((f) => ({ ...f, location_name: e.target.value }))
          }
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
        />
        <input
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
        />
        <button type="submit">Create Disaster</button>
      </form>
      <h3>Disasters</h3>
      <ul>
        {disasters.map((d) => (
          <li key={d.id}>
            <button onClick={() => selectDisaster(d)}>{d.title}</button>
          </li>
        ))}
      </ul>
      {selected && (
        <div style={{ marginTop: 20 }}>
          <h4>Selected: {selected.title}</h4>
          <div>
            <strong>Social Media:</strong>
            <ul>
              {social.map((p, i) => (
                <li key={i}>
                  {p.user}: {p.post}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Resources Nearby:</strong>
            <ul>
              {resources.map((r, i) => (
                <li key={i}>
                  {r.name} ({r.type})
                </li>
              ))}
            </ul>
          </div>
          <form onSubmit={submitReport} style={{ marginTop: 10 }}>
            <input
              placeholder="Report content"
              value={report.content}
              onChange={(e) =>
                setReport((r) => ({ ...r, content: e.target.value }))
              }
            />
            <input
              placeholder="Image URL"
              value={report.image_url}
              onChange={(e) =>
                setReport((r) => ({ ...r, image_url: e.target.value }))
              }
            />
            <button type="submit">Submit Report</button>
            <button type="button" onClick={verifyImage}>
              Verify Image
            </button>
          </form>
          {verifyResult && (
            <div>
              <strong>Verification:</strong> {verifyResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
