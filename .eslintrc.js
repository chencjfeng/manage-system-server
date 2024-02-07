module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        "standard-with-typescript",
        'eslint:recommended',
        'prettier',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    rules: {
        'prettier/prettier': 'error',
        '@typescript-eslint/no-extraneous-class': 'off',
    },
    plugins: [
        "@typescript-eslint"
    ],
    parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
    },
}
