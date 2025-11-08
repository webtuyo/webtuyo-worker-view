// config.js

export const SESSION_DURATION = 86400; //  in seconds
export const MAX_ATTEMPTS = 20; // Maximum login attempts before blocking
export const BLOCK_DURATION = 5 * 60; // 15 minutes in seconds
export const TOTP_INTERVAL = 30; // 30 seconds interval for TOTP
export const PBKDF2_ITERATIONS = 400000; // Strong password hashing iterations


export const GITHUB_USER_AGENT = 'Cloudflare-Worker-GitHub-OAuth';
export const DEFAULT_DOMAIN="https://app.webtuyo.com"
export const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
export const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
export const GITHUB_USER_API_URL = "https://api.github.com/user";
export const OAUTH_STATE_COOKIE_NAME = "oauth_state";
export const GITHUB_USER_ORGS_API_URL = "https://api.github.com/user/orgs"; // To list user's orgs
export const GITHUB_USER_TEAMS_API_URL = "https://api.github.com/user/teams"; // To list user's teams

// constants for deployment rate limiting
export const DEPLOY_PAGES_COOLDOWN_MINUTES = 15; // Default: 15 minutes
export const DEPLOY_PAGES_MAX_PER_24H = 15;      // Default: 15 times per 24 hours

// Define the scopes needed for GitHub OAuth
// ADDED "read:org" to be able to check organization and team membership
export const GITHUB_SCOPES = 'read:user user:email read:org';
