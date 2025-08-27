# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

# Kitty Boo

A drop-and-merge game built with **React + Vite + TailwindCSS**.

---

## Prerequisites
- Node.js LTS (18+)
- pnpm (`npm i -g pnpm`)

---

## Development

Start the dev server:

```bash
pnpm dev
```

---

## Color Palette

https://coolors.co/palette/ffffff-fff04c-ffc545-ff9b3e-ff7037-d15053-a3306f-75108b-110015-b8d14b

---

## How to Make Changes and Test in Android Studio

### 1. Make Changes

Edit your React app source code as usual in VS Code (or your preferred editor).

---

### 2. Build Your React App

Open a terminal in your project root and run:

```sh
pnpm build
```

This will generate a new production build in the `build/` folder.

---

### 3. Copy the Build to Android

Still in your project root, run:

```sh
npx cap copy
```

This copies your latest web build into the Android project.

---

### 4. Test in Android Studio

1. Open the `android` folder in Android Studio (or use `npx cap open android`).
2. Make sure your emulator or device is running and selected.
3. Click the **Run** (▶️) button in Android Studio to build and launch your app on the emulator/device.

---

### 5. Repeat

For each new change:
- Edit your code
- Run `pnpm build`
- Run `npx cap copy`
- Click **Run** in Android Studio

---

**Tip:**  
You do not need to re-add the Android platform or re-initialize Capacitor for each change—just repeat the steps above.