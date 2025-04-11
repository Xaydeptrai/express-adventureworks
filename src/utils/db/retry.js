async function retry(fn, options = { retries: 3, delay: 1000 }) {
  try {
    return await fn();
  } catch (err) {
    if (options.retries <= 0) throw err;

    await new Promise((resolve) => setTimeout(resolve, options.delay));
    if (options.onRetry) options.onRetry(err);

    return retry(fn, { ...options, retries: options.retries - 1 });
  }
}

module.exports = { retry };
