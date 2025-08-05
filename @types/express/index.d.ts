import { UserDocument } from '../../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
}

