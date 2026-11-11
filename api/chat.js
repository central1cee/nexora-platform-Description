
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    // Validate message
    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Please enter a message."
      });
    }

    const cleanMessage = message.trim();

    // Limit message length
    if (cleanMessage.length > 1000) {
      return res.status(400).json({
        success: false,
        error: "Message is too long. Maximum 1000 characters."
      });
    }

    // AI provider is not connected yet
    return res.status(503).json({
      success: false,
      error: "NEX AI is not connected to an AI provider yet.",
      status: "setup_required"
    });

  } catch (error) {
    console.error("NEX AI server error:", error);

    return res.status(500).json({
      success: false,
      error: "An internal server error occurred."
    });
  }
}
