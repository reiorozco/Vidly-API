module.exports = {
  env: {
    browser: true,
    commonjs: true,
    node:true,
    es2021: true,
    jest: true
  },
  extends: ["eslint:recommended", "plugin:node/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {},
};
