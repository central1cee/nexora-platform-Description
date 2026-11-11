export default async function handler(req, res) {
  const allowedOrigin = "https://central1cee.github.io";
  const origin = req.headers.origin;

  // CORS configuration
  if (origin === allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Browser preflight request
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  if (origin !== allowedOrigin) {
    return res.status(403).json({
      success: false,
      error: "Origin not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Please enter a message."
      });
    }

    if (message.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        error: "Message is too long."
      });
    }

    return res.status(503).json({
      success: false,
      status: "setup_required",
      error: "AI provider is not connected yet."
    });

  } catch (error) {
    console.error("NEX AI server error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error."
    });
  }
}
