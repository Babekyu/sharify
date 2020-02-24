import mongoose from 'mongoose';

const connect = () => {
  mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default {
  connect,
};
