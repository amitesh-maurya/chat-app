# 🖥️ Frontend Application# 🖥️ Frontend Application



Next.js frontend application for the ChatApp with responsive design and real-time features.Next.js frontend application for the ChatApp with responsive design and real-time features.



## 🚀 Getting Started## 🚀 Getting Started



### Prerequisites### Prerequisites

- Node.js 18+

- Node.js 18+- npm or yarn

- npm or yarn

### Installation

### Installation

```bash

```bash# From the frontend directory

# From the frontend directorynpm install

npm install```

```

### Environment Variables

### Environment Variables

Create a `.env.local` file in the frontend directory:

Create a `.env.local` file in the frontend directory:

```env

```envNEXT_PUBLIC_API_URL="http://localhost:3001"

NEXT_PUBLIC_API_URL="http://localhost:3001"NEXT_PUBLIC_WS_URL="ws://localhost:3002"

NEXT_PUBLIC_WS_URL="ws://localhost:3002"```

```

### Development

### Development

```bash

```bashnpm run dev

npm run dev```

```

The application will start on http://localhost:3000

The application will start on <http://localhost:3000># or

pnpm dev

### Building for Production# or

bun dev

```bash```

npm run build

npm startOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.

```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## 🏗️ Architecture

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Inter, a custom Google Font.

### Folder Structure

## Learn More

```text

apps/frontend/To learn more about Next.js, take a look at the following resources:

├── app/                   # Next.js App Router

│   ├── auth/             # Authentication pages- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

│   ├── dashboard/        # Main dashboard- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

│   ├── globals.css       # Global styles

│   ├── layout.tsx        # Root layoutYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

│   └── page.tsx          # Home page

├── components/           # React components## Deploy on Vercel

│   ├── ChatWindow.tsx    # Main chat interface

│   ├── FriendsList.tsx   # Friends sidebarThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

│   ├── AddFriendModal.tsx# Add friend modal

│   └── ...               # Other componentsCheck out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

├── lib/                  # Utilities and libraries
│   ├── api.ts           # API client
│   ├── stores/          # Zustand stores
│   └── hooks/           # Custom React hooks
└── public/              # Static assets
```

## 🎨 Key Features

- **Responsive Design**: Mobile-first approach with breakpoints
- **Real-time Updates**: WebSocket integration for live messaging
- **State Management**: Zustand for lightweight state management
- **Form Handling**: React Hook Form with Zod validation
- **File Uploads**: Image and voice message support
- **Modern UI**: Tailwind CSS with gradient designs

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## 📱 Mobile Development

The app is fully responsive. To test on mobile devices:

1. Find your local IP address
2. Update environment variables to use your IP instead of localhost
3. Access the app from your mobile device on the same network

## 🔗 API Integration

The frontend communicates with:

- **REST API** (port 3001) for authentication and data
- **WebSocket** (port 3002) for real-time features

## 🎯 Key Components

- **ChatWindow**: Main chat interface with message history
- **FriendsList**: Sidebar showing friends and online status
- **AddFriendModal**: Modal for sending friend requests
- **ProfileModal**: User profile management
- **VoiceRecorder**: Voice message recording
- **ImageUpload**: Image attachment handling