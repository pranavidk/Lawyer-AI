# Lawyer AI - Indian Legal Assistant Frontend

A modern, responsive React frontend built with Next.js for an AI-powered Indian legal assistant. Features contract analysis, legal term explanation, and compliance checking with a clean, accessible interface.

## 🚀 Features

### Core Functionality
- **📄 Contract Clause Analysis** - Upload contracts (PDF/DOCX/TXT) and get highlighted clauses with severity ratings
- **📚 Legal Term Explanation** - Plain-English explanations with Indian context and statutory references
- **🛡️ Compliance Scenarios** - Quick compliance checks for GST, IT Act, Employment, and Rental agreements
- **💬 Chat Assistant** - Interactive chat widget with conversation history

### UI/UX Features
- **🎨 Modern Design** - Clean, Gen-Z/millennial-friendly interface with Tailwind CSS
- **📱 Fully Responsive** - Mobile-first design with smooth breakpoints
- **🎭 Dual Tone Modes** - Formal and Casual UI tones with emoji support
- **🔒 Privacy Controls** - Local vs Cloud processing options
- **♿ Accessibility** - ARIA labels, keyboard navigation, screen reader support
- **✨ Smooth Animations** - Framer Motion transitions and micro-interactions

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **File Upload**: React Dropzone
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library
- **TypeScript**: Full type safety

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd lawyer-ai-frontend

# Install dependencies
npm install

# Copy environment variables
cp env.example .env.local

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Development mode (set to 'mock' to use mock data)
NEXT_PUBLIC_DEV_MODE=development

# Privacy mode (local or cloud)
NEXT_PUBLIC_PRIVACY_MODE=local
```

### Mock Mode
Set `NEXT_PUBLIC_DEV_MODE=mock` to use realistic mock data without a backend. Perfect for development and demos.

## 🏗️ Project Structure

```
lawyer-ai-frontend/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ChatWidget.tsx     # Chat interface
│   ├── ClauseList.tsx     # Contract clause display
│   ├── ComplianceForm.tsx # Compliance checker
│   ├── Disclaimer.tsx     # Legal disclaimer
│   ├── Navigation.tsx     # Main navigation
│   ├── TermExplainer.tsx  # Term explanation
│   ├── ThemeProvider.tsx  # Theme context
│   └── UploadContract.tsx # File upload
├── lib/                   # Utilities and services
│   ├── api.ts            # API service layer
│   └── utils.ts          # Helper functions
├── __tests__/            # Test files
└── public/               # Static assets
```

## 🔌 Backend Integration

### API Endpoints

The frontend expects the following backend endpoints:

#### File Upload
```http
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: File (PDF/DOCX/TXT)
- privacy: "local" | "cloud"
- tone: "formal" | "casual"

Response:
{
  "fileId": "string",
  "fileName": "string", 
  "fileSize": number,
  "uploadTime": "ISO string"
}
```

#### Contract Analysis
```http
POST /api/analyze
Content-Type: application/json

Body:
{
  "fileId": "string",
  "privacy": "local" | "cloud",
  "tone": "formal" | "casual"
}

Response:
{
  "fileId": "string",
  "fileName": "string",
  "analysisTime": "ISO string",
  "clauses": [
    {
      "id": "string",
      "title": "string",
      "severity": "low" | "medium" | "high",
      "explanation": "string",
      "originalText": "string",
      "suggestions": ["string"]
    }
  ],
  "summary": "string",
  "overallRisk": "low" | "medium" | "high"
}
```

#### Term Explanation
```http
POST /api/explain
Content-Type: application/json

Body:
{
  "term": "string",
  "privacy": "local" | "cloud", 
  "tone": "formal" | "casual"
}

Response:
{
  "term": "string",
  "definition": "string",
  "summary": "string",
  "example": "string",
  "statutoryReferences": ["string"]
}
```

#### Compliance Check
```http
POST /api/compliance
Content-Type: application/json

Body:
{
  "scenario": "gst" | "it_act" | "employment" | "rental",
  "formData": { "key": "value" },
  "privacy": "local" | "cloud",
  "tone": "formal" | "casual"
}

Response:
{
  "scenario": "string",
  "flags": [
    {
      "severity": "low" | "medium" | "high",
      "issue": "string",
      "description": "string", 
      "recommendation": "string"
    }
  ],
  "nextSteps": ["string"],
  "overallRisk": "low" | "medium" | "high"
}
```

#### Chat Message
```http
POST /api/chat
Content-Type: application/json

Body:
{
  "message": "string",
  "chatHistory": [{"type": "user" | "assistant", "content": "string"}],
  "privacy": "local" | "cloud",
  "tone": "formal" | "casual"
}

Response:
{
  "message": "string",
  "timestamp": "ISO string"
}
```

### Local LLM Integration

To connect with a local LLM after RAG/fine-tuning:

1. **Update API URL**: Set `NEXT_PUBLIC_API_URL` to your local LLM server
2. **Expected Request Format**: The frontend sends structured requests with context
3. **Response Format**: Ensure your LLM returns JSON matching the expected schemas

#### Example Local LLM Request/Response

**Request to your LLM endpoint:**
```json
{
  "prompt": "Analyze this contract clause: [clause text]",
  "context": "Indian contract law",
  "tone": "casual",
  "privacy": "local"
}
```

**Expected Response:**
```json
{
  "analysis": "Plain English explanation...",
  "severity": "high",
  "suggestions": ["Recommendation 1", "Recommendation 2"]
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
- **Component Tests**: Test UI components with React Testing Library
- **API Tests**: Test API service layer with mock data
- **Integration Tests**: Test user workflows end-to-end

## 🎨 Customization

### Styling
- **Colors**: Modify `tailwind.config.js` for brand colors
- **Fonts**: Update font imports in `app/globals.css`
- **Animations**: Customize Framer Motion variants in components

### Content
- **Mock Data**: Update mock responses in `lib/api.ts`
- **Scenarios**: Modify compliance scenarios in `ComplianceForm.tsx`
- **Terms**: Add more legal terms in the API service

### Features
- **New Components**: Add components in `components/` directory
- **API Endpoints**: Extend API service in `lib/api.ts`
- **Routes**: Add new pages in `app/` directory

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Other Platforms
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔒 Security Considerations

- **File Upload**: Validate file types and sizes on backend
- **XSS Protection**: Sanitize user inputs
- **CORS**: Configure proper CORS headers
- **Rate Limiting**: Implement API rate limiting
- **Data Privacy**: Handle sensitive legal data appropriately

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool provides general information only and does not constitute legal advice. Always consult with a qualified legal professional for specific legal matters.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the test files for usage examples

---

Built with ❤️ for the Indian legal community