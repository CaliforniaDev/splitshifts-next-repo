# SplitShifts

SplitShifts is a web application designed to streamline the scheduling process for organizations. Built with Next.js, this admin-focused app offers a comprehensive dashboard for managing shifts, appointments, and events efficiently. Key features include viewing upcoming shifts, handling appointments, managing current events, and setting reminders. The app aims to reduce scheduling conflicts and improve overall productivity.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
- [License](#license)
- [Contact](#contact)

## Features

### Implemented Features

- None yet (project setup in progress)

### Planned Features

- User-friendly admin dashboard
- Manage upcoming shifts, appointments, and current events
- Set and view reminders for important tasks
- Real-time alerts for shift coverage and scheduling changes
- Employee availability summary
- Shift swap and schedule change request handling

## Technologies Used

- Next.js
- React.js
- Tailwind CSS
- Node.js
- MongoDB

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed
- MongoDB installed and running

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/CaliforniaDev/splitshifts-nextjs.git

   ```

2. Navigate to project directory:

   ```bash
   cd splitshifts-app

   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

1. Start the development server:

   ```bash
   npm run dev

   ```

2. Open your browser and visit 'http://locolhost:3000' to see the app in action.

### Overview

This project uses a consistent type scale across various components and pages. The type scale is defined in multiple files, including `typography.css`, `tailwind.config.ts`, `fonts.ts`, and `layout.tsx`.

### Files and Their Roles

- **typography.css**: Defines the type scale categories such as Display, Headline, Title, Label, and Body fonts.
- **tailwind.config.ts**: Extends Tailwind's theme to include custom colors and typography settings.
- **fonts.ts**: Defines the font families and their respective weights.
- **layout.tsx**: Applies the defined typography and layout styles to the application.

### How They Link Together

The type scale defined in `typography.css` is referenced in the Tailwind configuration to ensure consistent typography across the application. Tailwind's `@layer` feature is used to apply these styles globally. The `fonts.ts` file defines the font families and weights, which are then used in `tailwind.config.ts`. The `layout.tsx` file applies these styles to the application layout.

Refer to the comments in each file for more detailed information.

## License

All Rights Reserved

Copyright (c) 2024 Leo Daniels

All rights are reserved. No part of this software or its associated documentation files (the "Software") may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the author, except in the case of brief quotations embodied in critical reviews and certain other noncommercial uses permitted by copyright law.

## Contact

For any inquiries or feedback, please contact:

- Leo Daniels - [leodaniels@CaliforniaDev.com](mailto:leodaniels@californiadev.com)
- GitHub: [@CaliforniaDev](https://github.com/CaliforniaDev)
