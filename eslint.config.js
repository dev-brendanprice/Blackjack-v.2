import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  { 
    languageOptions: { globals: globals.browser },
    rules: { "no-constant-condition": "off" }
  }
];