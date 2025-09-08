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
  },
  result:{
        address:{
            formattedAddress: {
                needs: {
                    lineOne: true,
                    lineTwo: true,
                    city: true,
                    country: true,
                    pinCode: true
                },
                compute: (addr) => {
                    return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}-${addr.pinCode}`
                }
            }
        }
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});