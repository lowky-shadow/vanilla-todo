export const retryWithBackoff = async (
  fn,
  { retries = 3, delay = 300, factor = 2 } = {}
) => {
  let attempt = 0;
  let currentDelay = delay;

  console.log(attempt);
  while (attempt < retries) {
    try {
      return await fn();
    } catch (err) {
      attempt++;

      if (attempt >= retries) {
        throw err;
      }

      await new Promise((resolve) => setTimeout(resolve, currentDelay));

      currentDelay *= factor;
    }
  }
};
