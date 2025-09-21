# Lawyer AI - Indian Legal Assistant Frontend

A modern, responsive React frontend for an AI-powered legal assistant platform designed specifically for Indian legal system. Built with TypeScript, Vite, and Tailwind CSS, featuring a professional design system and smooth animations.

## Features

- **📄 Document Analysis**: Upload and analyze legal documents with AI-powered insights
- **🤖 JuriSense AI Chat**: Interactive legal assistant for real-time legal guidance
- **📚 Legal Knowledge Base**: Comprehensive database of Indian legal concepts and precedents
- **🎨 Modern UI/UX**: Professional design with dark/light theme support
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **⚡ Performance**: Fast loading with Vite and optimized React components
- **🔒 Security**: Built with security best practices for legal data handling

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3.4 with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **Animations**: Framer Motion
- **Routing**: React Router DOM 6
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React
- **Font**: Google Inter

## Installation

### Prerequisites

- Node.js 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm or yarn package manager

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Lawyer-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=JuriSense AI
VITE_APP_VERSION=1.0.0
```

### Theme Configuration

The app supports light and dark themes. Theme preferences are stored in localStorage and can be toggled via the navbar.

### API Integration

Configure the backend API URL in the environment variables. The frontend expects the following endpoints:

- `POST /api/chat` - Chat with AI assistant
- `POST /api/analyze` - Document analysis
- `GET /api/legal-concepts` - Legal knowledge base

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── HeroSection.tsx # Landing page hero
│   ├── Navbar.tsx      # Navigation component
│   └── ...
├── contexts/           # React contexts
│   └── ThemeContext.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
│   ├── Index.tsx       # Homepage
│   ├── ChatAssistant.tsx
│   ├── DocumentAnalyzer.tsx
│   └── ...
└── main.tsx           # Application entry point
```

## Backend Integration

This frontend is designed to work with a RESTful API backend. Key integration points:

### Chat Assistant
- Real-time messaging with AI legal assistant
- Message history and context preservation
- Typing indicators and response streaming

### Document Analyzer
- File upload with drag-and-drop support
- Document processing and analysis
- Results visualization and export

### Authentication
- User session management
- Protected routes and permissions
- Profile and settings management

## Testing

### Development Testing
```bash
# Run development server with hot reload
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

### Production Build
```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## Customization

### Design System
The app uses a custom design system defined in `src/index.css`:

- **Color Palette**: Aurora Borealis theme with electric cyan and cosmic magenta
- **Typography**: Google Inter font family
- **Spacing**: Consistent spacing scale using Tailwind utilities
- **Animations**: Smooth transitions with Framer Motion

### Component Customization
All UI components are built with Radix UI primitives and can be customized by modifying their respective files in `src/components/ui/`.

### Theme Customization
Modify the CSS custom properties in `src/index.css` to customize colors, spacing, and other design tokens.

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure redirects for SPA routing

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## Security

- **Data Protection**: All sensitive data is handled securely
- **Input Validation**: Client-side validation with Zod schemas
- **HTTPS**: Enforced in production environments
- **CSP**: Content Security Policy headers configured

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Test changes thoroughly before submitting

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This application is for informational purposes only and does not constitute legal advice. Users should consult with qualified legal professionals for specific legal matters. The AI assistant provides general guidance and should not be relied upon for critical legal decisions.

## Support

For technical support or questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions