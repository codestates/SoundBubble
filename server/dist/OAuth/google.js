"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google_auth_library_1 = require("google-auth-library");
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirect_url = process.env.CLIENT_REDIRECT_URL;
const googleOAuthClient = new google_auth_library_1.OAuth2Client(googleClientId, googleClientSecret, redirect_url);
console.log("googleOAuthClient", googleOAuthClient);
exports.default = googleOAuthClient;
//# sourceMappingURL=google.js.map