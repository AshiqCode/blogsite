import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { first_name, email, message } = formData;
    if (!first_name || !email || !message) {
      toast.error("❌ Please fill out all fields!");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("❌ Please enter a valid email address.");
      return;
    }

    setLoading(true);
    emailjs
      .send(
        "service_r47rh4n",
        "template_b71q2a6",
        formData,
        "IZeQAt9QusTErsVma"
      )
      .then(
        (response) => {
          toast.success("Message sent successfully!");
          setFormData({ first_name: "", email: "", message: "" });
          setLoading(false);
        },
        (error) => {
          toast.error("❌ Failed to send message. Please try again.");
          setLoading(false);
        }
      );
  };

  return (
    <div style={{ ...styles.wrapper, padding: isMobile ? "1rem" : "2rem" }}>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      <div
        style={{
          ...styles.card,
          flexDirection: isMobile ? "column" : "row",
          minHeight: isMobile ? "auto" : "320px",
        }}
      >
        {/* Left Panel */}
        <div
          style={{
            ...styles.leftPanel,
            padding: isMobile ? "1.5rem" : "2rem",
            borderRadius: isMobile ? "16px 16px 0 0" : "16px 0 0 16px",
          }}
        >
          <h2 style={styles.panelTitle}>Get in Touch</h2>
          <p style={styles.panelText}>
            Have a question or want to work together? Send us a message and
            we’ll get back to you quickly.
          </p>
        </div>

        {/* Right Form */}
        <div
          style={{
            ...styles.rightPanel,
            padding: isMobile ? "1.5rem" : "2rem",
          }}
        >
          <form style={styles.form} onSubmit={handleSubmit}>
            {["first_name", "email", "message"].map((field) => (
              <div key={field} style={styles.inputGroup}>
                {field === "message" ? (
                  <textarea
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      height: isMobile ? "80px" : "100px",
                      paddingTop: "1.2rem",
                      resize: "none",
                    }}
                    required
                  />
                ) : (
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    style={{ ...styles.input, paddingTop: "1.2rem" }}
                    required
                  />
                )}
                <label
                  style={{
                    ...styles.label,
                    top: formData[field] ? "-8px" : "50%",
                    fontSize: formData[field] ? "0.75rem" : "0.9rem",
                    color: formData[field] ? "#4a90e2" : "#aaa",
                    transform: formData[field]
                      ? "translateY(0)"
                      : "translateY(-50%)",
                  }}
                >
                  {field === "first_name"
                    ? "Your Name"
                    : field === "email"
                    ? "Email Address"
                    : "Your Message"}
                </label>
              </div>
            ))}

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <IoPaperPlaneOutline /> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "#f7f8fa",
    display: "flex",
    justifyContent: "center",
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    display: "flex",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    maxWidth: "850px",
    width: "100%",
    overflow: "hidden",
  },
  leftPanel: {
    flex: 1,
    background: "linear-gradient(135deg, #4a90e2, #357ae8)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  panelTitle: {
    fontSize: "1.8rem",
    fontWeight: "600",
    marginBottom: "0.8rem",
  },
  panelText: {
    fontSize: "0.95rem",
    lineHeight: "1.4",
  },
  rightPanel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "100%",
  },
  inputGroup: {
    position: "relative",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "0.8rem 0.75rem",
    borderRadius: "10px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "0.95rem",
    backgroundColor: "#fafafa",
    transition: "all 0.3s",
  },
  label: {
    position: "absolute",
    left: "12px",
    pointerEvents: "none",
    transition: "all 0.2s ease-out",
  },
  button: {
    padding: "0.7rem 1rem",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(90deg, #4a90e2, #357ae8)",
    color: "#fff",
    fontSize: "0.95rem",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.4rem",
    fontWeight: "500",
    transition: "all 0.3s",
  },
};

export default ContactUs;
