import { Request, Response } from "express";
import { SettingsService } from "../services/SettingsService";

class SettingsController {
  async create(req: Request, res: Response) {
    const { chat, username } = req.body;

    const settingsService = new SettingsService();

    try {
      const settings = await settingsService.create({ chat, username });

      return res.status(201).json(settings);
    } catch (err) {
      return res.status(400).json({ result: err.message });
    }
  }

  async index(req: Request, res: Response) {
    const settingsService = new SettingsService();

    const settings = await settingsService.index();

    return res.json(settings);
  }
}

export { SettingsController };

