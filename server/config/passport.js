const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const { hashPassword } = require("../helpers/auth");

const initPassport = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails && profile.emails[0] && profile.emails[0].value;
                    if (!email) return done(null, false, { message: "No email from Google" });

                    let user = await User.findOne({ email });

                    if (!user) {
                        // create a user with a random password (hashed) so schema validation pass
                        const randPwd = (Math.random() + 1).toString(36).substring(2);
                        const hashed = await hashPassword(randPwd);
                        user = await User.create({
                            email,
                            firstName: (profile.name && profile.name.givenName) || "",
                            lastName: (profile.name && profile.name.familyName) || "",
                            password: hashed,
                            isEmailVerified: true,
                            provider: "google",
                        });
                    } else if (!user.provider || user.provider !== "google") {
                        // If user exists but provider is not set to google, update it
                        user.provider = "google";
                        await user.save();
                    }
                    return done(null, user);
                } catch (err) {
                    return done(err, false);
                }
            }
        )
    );
};

module.exports = { initPassport };