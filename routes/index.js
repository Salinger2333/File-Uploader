import { Router } from "express";
import authRouter from "./auth.js";
import { prisma } from "../lib/prisma.js";

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  res.render("index");
});

indexRouter.get("/home", async (req, res, next) => {
  if (!req.user) {
    return res.redirect("/auth/login");
  }

  try {
    const [folders, files] = await Promise.all([
      prisma.folder.findMany({
        where: { userId: req.user.id },
        include: { files: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.file.findMany({
        where: { userId: req.user.id, folderId: null },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    res.render("home", { user: req.user, folders, files });
  } catch (error) {
    next(error);
  }
});

indexRouter.use("/auth", authRouter);

export default indexRouter;