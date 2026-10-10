import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT ?? 3333);

app.use(cors());
app.use(express.json());

const patientSchema = z.object({
  name: z.string().trim().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z.string().trim().email("Informe um e-mail válido."),
  birthDate: z.string().date("Use a data no formato AAAA-MM-DD.")
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "laboratorio-api" });
});

app.get("/api/patients", async (_req, res, next) => {
  try {
    const patients = await prisma.patient.findMany({ orderBy: { createdAt: "desc" } });
    res.json(patients);
  } catch (error) {
    next(error);
  }
});

app.post("/api/patients", async (req, res, next) => {
  const parsed = patientSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
    return;
  }

  try {
    const patient = await prisma.patient.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        birthDate: new Date(`${parsed.data.birthDate}T12:00:00.000Z`)
      }
    });
    res.status(201).json(patient);
  } catch (error) {
    next(error);
  }
});

app.get("/api/patients/:id", async (req, res, next) => {
  try {
    const patient = await prisma.patient.findUnique({ where: { id: req.params.id } });
    if (!patient) {
      res.status(404).json({ error: "Paciente não encontrado." });
      return;
    }
    res.json(patient);
  } catch (error) {
    next(error);
  }
});

app.put("/api/patients/:id", async (req, res, next) => {
  const parsed = patientSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dados inválidos", details: parsed.error.flatten() });
    return;
  }

  try {
    const patient = await prisma.patient.update({
      where: { id: req.params.id },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        birthDate: new Date(`${parsed.data.birthDate}T12:00:00.000Z`)
      }
    });
    res.json(patient);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/patients/:id", async (req, res, next) => {
  try {
    await prisma.patient.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : "Erro interno.";
  if (message.includes("Unique constraint failed")) {
    res.status(409).json({ error: "Já existe um paciente com esse e-mail." });
    return;
  }
  if (message.includes("Record to") && message.includes("not found")) {
    res.status(404).json({ error: "Registro não encontrado." });
    return;
  }
  console.error(error);
  res.status(500).json({ error: "Erro interno do servidor." });
});

app.listen(port, () => {
  console.log(`API disponível em http://localhost:${port}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
