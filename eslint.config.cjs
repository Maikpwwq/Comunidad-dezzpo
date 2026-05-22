const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const globals = require("globals");
const reactRefresh = require("eslint-plugin-react-refresh");
// import reactRefresh from "eslint-plugin-react-refresh"; ??

const {
    fixupConfigRules,
} = require("@eslint/compat");

const tsParser = require("@typescript-eslint/parser");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    rules: {
        "react-refresh/only-export-components": "warn",
        "@typescript-eslint/no-namespace": "off",
    },

    linterOptions: {
        reportUnusedDisableDirectives: true,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        ecmaVersion: "latest",
        sourceType: "module",
        parserOptions: {},
        parser: tsParser,
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    plugins: {
        "react-refresh": reactRefresh,
    },

    extends: fixupConfigRules(compat.extends(
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
    )),
}, globalIgnores(["dist/*"])]);
