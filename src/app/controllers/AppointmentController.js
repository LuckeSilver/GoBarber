import User from "../models/User";
import Appointment from "../models/Appointment";
import * as Yup from "yup";
import { startOfHour, parseISO, isBefore } from "date-fns";

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

    // Checando se a data do agendamento já passou ou é uma data válida
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: "Essa data já passou." });
    }

    // Checando se o prestador de serviços já tem algo marcado
    //para o horário selecionado

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: "O horário escolhido não está vago" });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
