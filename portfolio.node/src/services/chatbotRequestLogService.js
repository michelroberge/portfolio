const ChatbotRequestLog = require('../models/ChatbotRequestLog');
const geoip = require('geoip-lite');

/**
 * Logs a chatbot request to MongoDB.
 * @param {Object} params - The log parameters.
 * @param {string} params.ip - The requestor's IP address.
 * @param {string} [params.userAgent] - The user agent string.
 * @param {string} [params.origin] - The origin header.
 * @param {string} [params.referer] - The referer header.
 * @param {string} [params.host] - The host header.
 * @param {Object} [params.cookies] - Cookies sent with the request.
 * @param {Object} params.requestPayload - The chatbot request payload.
 * @param {Object} [params.responsePayload] - The chatbot response payload.
 * @param {string} [params.status] - Status (success, error, blocked, etc.).
 * @param {string} [params.error] - Error message, if any.
 * @param {boolean} [params.blacklisted] - If the IP is blacklisted.
 * @param {boolean} [params.whitelisted] - If the IP is whitelisted.
 * @returns {Promise<Object>} The saved log document.
 */
async function logChatbotRequest(params) {
  const { ip } = params;
  let country = '';
  if (ip) {
    const geo = geoip.lookup(ip);
    if (geo && geo.country) {
      country = geo.country;
    }
  }
  const logEntry = new ChatbotRequestLog({
    ...params,
    country,
  });
  return await logEntry.save();
}

/**
 * Gets chatbot request history with pagination
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Number of items per page
 * @returns {Promise<Object>} Object containing logs, total count, page, and limit
 */
async function getChatbotHistory(page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  
  const [logs, total] = await Promise.all([
    ChatbotRequestLog.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit)
      .lean(),
    ChatbotRequestLog.countDocuments()
  ]);

  return {
    logs,
    total,
    page,
    limit
  };
}

/**
 * Deletes a chatbot request log entry
 * @param {string} id - The log entry ID to delete
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
async function deleteChatbotRequestLog(id) {
  const result = await ChatbotRequestLog.findByIdAndDelete(id);
  return !!result;
}

module.exports = {
  logChatbotRequest,
  getChatbotHistory,
  deleteChatbotRequestLog,
};