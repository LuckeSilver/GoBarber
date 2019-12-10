import User from "../models/User";

class UserControler {
  async store(req, res) {
    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(400).json({ error: "Usuário existente." });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider
    }); 
  }

  async update(req, res) {
    console.log(req.userId);

    return res.json({ ok: true });
  }
}

export default new UserControler();
