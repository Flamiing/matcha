class AuthController {
    static testController(req, res) {
        return res.json({ test: "This is a test return" });
    }
}

export default AuthController;
