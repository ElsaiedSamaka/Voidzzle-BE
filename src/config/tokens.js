const tokenTypes = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET_PASSWORD: 'resetPassword',
  VERIFY_EMAIL: 'verifyEmail'
};

const tokenExpiration = {
  ACCESS: '15m',
  REFRESH: '30d',
  RESET_PASSWORD: '10m',
  VERIFY_EMAIL: '10m'
};

export { tokenTypes, tokenExpiration };
