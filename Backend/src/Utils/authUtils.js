export function checkAuthStatus(req) {
    const { user } = req.session;
    if (user) return { isAuthorized: true, user: user };
    return { isAuthorized: false };
}