/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of import
    project: "tsconfig.json",
  },
  plugins: ["import", "prettier", "@typescript-eslint", "simple-import-sort"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
    "plugin:prettier/recommended", // KEEP THIS LAST
  ],
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
        fixStyle: "separate-type-imports",
      },
    ],
    "import/namespace": "off",
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "import/first": "error",
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          ["^\\u0000"],
          ["^node:"],
          ["^@?\\w"],
          ["^"],
          ["^\\."],
          ["^node:.*\\u0000$", "^@?\\w.*\\u0000$", "^[^.].*\\u0000$", "^\\..*\\u0000$"],
        ],
      },
    ],
  },
  overrides: [
    {
      files: ["./*.c?js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
};
