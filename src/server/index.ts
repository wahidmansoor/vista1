import { validateEnv } from './utils/validateEnv';
import app from './app.js';

validateEnv();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});