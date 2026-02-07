# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-02-07

### Added

- **Project Setup**: Vite + React 19 + TypeScript + Tailwind CSS v4 scaffold
- **Firebase Integration**: Auth, Firestore, Storage, Hosting configuration
- **Dependencies**: firebase, react-router-dom, tailwindcss, @headlessui/react, qrcode.react
- **Google Fonts**: Noto Sans SC for Chinese character support
- **Shared Types**: Resource, Guest, ServiceDocument, Feedback, Note, Volunteer types
- **Language System**: 4-language support (en, es, zh, ht) with constants, labels, NonEnLanguageCode
- **Category System**: 10 categories with 4-language translations and icons
- **Translation Utils**: computeTranslationStatus, computeAllTranslationStatuses, getTranslatedText
- **Print Headers**: Translated print header constants for all 4 languages
- **Authentication**: Email/password login with AuthProvider, useAuth hook, ProtectedRoute
- **Login Page**: Email/password form with error handling and post-login redirect
- **Volunteer Profiles**: Firestore read on auth to fetch role from volunteers/{uid}
- **Pre-commit Hooks**: Husky + lint-staged with ESLint + Prettier
- **Test Suite**: Vitest with 49 tests (translationUtils, categories, languages, TagInput, CategoryBadge, LoginPage)
- **Code Quality**: ESLint flat config, eslint-config-prettier, TypeScript strict mode
- **Firestore Rules**: Basic auth-gated read/write access
- **Firebase Hosting**: firebase.json with SPA rewrite config
