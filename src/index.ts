import express, {Express, Request, Response} from 'express';
import { PORT } from './secrets';
import rootRouter from './routers';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/errors';
import { SignupSchema } from './schema/users';

const app: Express = express();

app.use(express.json());

app.use("/api", rootRouter)

app.use(errorMiddleware);

export const prismaClient = new PrismaClient({
  log: ['query'],
}).$extends({
  query: {
    user: {
      create({ args, query }) {
        args.data = SignupSchema.parse(args.data);
        return query(args);
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});