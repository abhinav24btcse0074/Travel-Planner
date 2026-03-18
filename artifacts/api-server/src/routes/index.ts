import { Router, type IRouter } from "express";
import healthRouter from "./health";
import flightsRouter from "./flights";
import hotelsRouter from "./hotels";
import offersRouter from "./offers";
import destinationsRouter from "./destinations";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/flights", flightsRouter);
router.use("/hotels", hotelsRouter);
router.use("/offers", offersRouter);
router.use("/destinations", destinationsRouter);

export default router;
