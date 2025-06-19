import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: '',
    rating: 0
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.feedback || formData.rating === 0) {
      return alert("Feedback and rating are required");
    }
    try {
      await axios.post('/api/feedback', formData);
      setMessage('Thank you for your feedback!');
      setFormData({ name: '', email: '', feedback: '', rating: 0 });
    } catch (err) {
      console.error(err);
      alert('Submission failed');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Feedback Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name (optional)"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        /><br />
        <input
          placeholder="Email (optional)"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        /><br />
        <textarea
          required
          placeholder="Your feedback"
          value={formData.feedback}
          onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
        /><br />

        <label>Rate us:</label>
        <StarRating
          rating={formData.rating}
          onRate={(r) => setFormData({ ...formData, rating: r })}
        />

        <br />
        <button type="submit">Submit</button>
      </form>

      <p>{message}</p>

      {/* ✅ Admin Login Button */}
      <button
        onClick={() => navigate('/login')}
        style={{ marginTop: '1rem', backgroundColor: '#333', color: '#fff' }}
      >
        Admin Login
      </button>
    </div>
  );
}

function StarRating({ rating, onRate }) {
  const handleClick = (index) => onRate(index + 1);

  return (
    <div style={{ fontSize: "24px", color: "#ffd700", cursor: "pointer" }}>
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          onClick={() => handleClick(i)}
          style={{ marginRight: "5px" }}
        >
          {i < rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

export default FeedbackForm;
