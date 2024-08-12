# Typeface Documentation

## Overview
This folder contains the styles and typography definitions for the project.

## Files and Their Roles
- **typography.css**: Defines the type scale categories such as Display, Headline, Title, Label, and Body fonts.
- **fonts.ts**: Defines the font families and their respective weights.

## How They Link Together
The type scale defined in `typography.css` is referenced in the Tailwind configuration to ensure consistent typography across the application. The `fonts.ts` file defines the font families and weights, which are then used in `tailwind.config.ts`.

## Usage
- **Typography**: Use the classes defined in `typography.css` to apply consistent typography styles.
- **Fonts**: Define and use custom fonts in `fonts.ts`.

Refer to the comments in each file for more detailed information.