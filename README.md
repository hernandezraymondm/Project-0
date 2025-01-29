## Overview

`A NEXT.js starter kit so you don't have to start from scratch. Equipped with secure session management, TOTP 2FA, and email verification.`

![Demo](public/demo.gif)

### Key Features

- Two-factor authentication(2FA)
- Forgot password functionality
- Email Verification
- Enable/disable 2FA in Dashboard page
- Change password in Dashboard page
- Update profile in Dashboard page
- Activity logs
- Secure session management

### Technologies

| Technology 1 | Technology 2 | Technology 3    | Technology 4 |
| ------------ | ------------ | --------------- | ------------ |
| Next.js      | Resend       | React Email     | otpauth TOTP |
| ShadcnUI     | PostgreSQL   | Prisma          | Bcrypt       |
| JWT          | TailwindCSS  | React Hook Form | Zod          |
| Next.js      | Typescript   | Node.js         |              |

## Getting Started

**Prerequisites Before you begin, ensure you have met the following requirements:**

- **Node.js**: Install Node.js from [nodejs.org](https://nodejs.org/)
- **npm**: Install npm from [npmjs.com](https://www.npmjs.com/)
- **Git**: Install Git from [git-scm.com](https://git-scm.com/)

**Follow the setup instructions to get your Next-Auth-Template up and running.**

1. Clone the repository:

```bash
git clone https://github.com/hernandezraymondm/Project-0.git
cd Project-0
```

2. Install Dependencies:

```bash
npm install
```

3. Setup .env file

```bash
NEXT_PUBLIC_APP_NAME="Project Zero"

NEXT_PUBLIC_APP_URL=http://localhost:3000

JWT_SECRET=your_jasonwebtoken_secret

DATABASE_URL=your_database_url

RESEND_API_KEY=your_resend_api_key
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

> 💡 **Hint**: Open [http://localhost:3000](http://localhost:3000) with your browser
> to see the result.

### Dev Commands

```bash
npx prisma studio             # Open Prisma Studio GUI
npx prisma generate           # Generate Prisma Client based on your schema
npx prisma db push            # Push the Prisma schema state to the database
npx prisma migrate reset      # Reset the database by applying all migrations from scratch
```

> 💡 **Hint**: After running `npx prisma migrate reset`, you should run
> `npx prisma db push` to ensure that your schema changes are correctly
> applied to the database.
