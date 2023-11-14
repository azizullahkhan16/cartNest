export const handleLoginController = async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = emailTest.test(email);
    const validPassword = password.length > 7;

    if (!validEmail || !validPassword) {
      res
        .status(400)
        .json({ success: false, message: "Invalid Email or password." });
      return;
    }

    try {
    } catch (error) {}
  }
};

export const handleSellerLoginController = async (req, res) => {};
