import { getEnvVar } from '@/utils/environment';

const TestEnvironment = () => {
  console.log(getEnvVar('NODE_ENV'));
  return null;
};

export default TestEnvironment;
