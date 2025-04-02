// portfolio.node/src/services/providerConfigService.js
const ProviderConfig = require("../models/ProviderConfig");

async function getAllConfigs() {
  return ProviderConfig.find({});
}

async function getConfigByProvider(provider) {
    return ProviderConfig.findOne({
        provider: { $regex: '^' + provider + '$', $options: 'i' }
      });
}

async function updateConfig(provider, configData) {
  // Upsert: if a config for the provider exists, update it; otherwise, create it.
  return ProviderConfig.findOneAndUpdate({ provider }, configData, { new: true, upsert: true });
}

async function prepopulateDefaultConfigs() {
    const count = await ProviderConfig.countDocuments();
    if (count === 0) {
      const defaultConfigs = [];
  
      // Pre-populate for Google if env vars are provided.
      if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL) {
        defaultConfigs.push({
          provider: "google",
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
        });
      }
      // Similarly for Facebook
      if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET && process.env.FACEBOOK_CALLBACK_URL) {
        defaultConfigs.push({
          provider: "facebook",
          clientId: process.env.FACEBOOK_CLIENT_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        });
      }
      // GitHub
      if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET && process.env.GITHUB_CALLBACK_URL) {
        defaultConfigs.push({
          provider: "github",
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: process.env.GITHUB_CALLBACK_URL,
        });
      }
      // Microsoft
      if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET && process.env.MICROSOFT_CALLBACK_URL) {
        defaultConfigs.push({
          provider: "microsoft",
          clientId: process.env.MICROSOFT_CLIENT_ID,
          clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
          callbackURL: process.env.MICROSOFT_CALLBACK_URL,
        });
      }
      if (defaultConfigs.length > 0) {
        await ProviderConfig.insertMany(defaultConfigs);
        console.log("Default provider configurations have been pre-populated.");
      }
    }
  }

  async function getAIConfig() {
    let config = await ProviderConfig.findOne();
    if (!config) {
      config = new ProviderConfig({ provider: "ollama" });
      await config.save();
    }
    return config;
  }
  
module.exports = {
  getAIConfig,
  getAllConfigs,
  getConfigByProvider,
  updateConfig,
  prepopulateDefaultConfigs
};
