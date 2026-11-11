export default async function handler(req, res) {
  const ALLOWED_ORIGIN = "https://central1cee.github.io";
  const origin = req.headers.origin;

  // Security headers
  res.setHeader("Vary", "Origin");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // CORS configuration
  if (origin === ALLOWED_ORIGIN) {
    res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "86400");
  }

  // Preflight request
  if (req.method === "OPTIONS") {
    if (origin !== ALLOWED_ORIGIN) {
      return res.status(403).json({
        success: false,
        error: "Origin not allowed"
      });
    }

    return res.status(204).end();
  }

  // Only POST is accepted
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  // Check website origin
  if (origin !== ALLOWED_ORIGIN) {
    return res.status(403).json({
      success: false,
      error: "Origin not allowed"
    });
  }

  // Check content type
  const contentType = req.headers["content-type"] || "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return res.status(415).json({
      success: false,
      error: "Content-Type must be application/json"
    });
  }

  try {
    const body = req.body || {};

    const message = body.message;
    const history = body.history;

    // Validate message
    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid message."
      });
    }

    const cleanMessage = message.trim();

    if (cleanMessage.length > 1000) {
      return res.status(400).json({
        success: false,
        error: "Message must not exceed 1000 characters."
      });
    }

    // Validate conversation history
    if (history !== undefined && !Array.isArray(history)) {
      return res.status(400).json({
        success: false,
        error: "Invalid conversation history."
      });
    }

    const conversation = history || [];

    if (conversation.length > 10) {
      return res.status(400).json({
        success: false,
        error: "Conversation history is too long."
      });
    }

    for (const item of conversation) {
      if (
        !item ||
        typeof item !== "object" ||
        !["user", "assistant"].includes(item.role) ||
        typeof item.content !== "string" ||
        !item.content.trim() ||
        item.content.length > 1000
      ) {
        return res.status(400).json({
          success: false,
          error: "Invalid conversation message."
        });
      }
    }

    /*
      NEX AI ENGINE CONNECTION

      This endpoint is prepared to receive:
      - message
      - conversation history

      A compatible AI provider must be connected here
      before real AI replies can be generated.

      Never put provider API keys in index.html.
      Keep provider credentials on the server only.
    */

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
