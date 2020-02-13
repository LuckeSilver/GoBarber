import User from "../models/User";
import Appointment from "../models/Appointment";
import * as Yup from "yup";

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na validação" });
    }

    const { provider_id, date } = req.body;

    /*
      checando se o usuário é de fato um provider 
    */

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: "You can only appointments with providers" });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
