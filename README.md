<p align="center">
  <a href="https://github.com/goncalojbsousa/EasyPeasyCV">
    <img src="public/logo.webp" height="96" alt="EasyPeasyCV logo" style="margin-bottom: 10px;" />
    <h3 align="center">EasyPeasyCV</h3>
  </a>
</p>

A modern, responsive CV builder application built with Next.js, React, and TypeScript. Features real-time preview, PDF generation, and multi-language support.

## 🌟 Features

- **3 Professional Templates**: Classic, Modern, and Creative designs
- **Full Customization**: Choose colors, reorder sections, and customize every detail
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Auto-Save**: Your data is automatically saved in the browser
- **Multi-language**: Available in Portuguese, English and Spanish
- **Privacy-First**: Everything stays in your browser, no external servers
- **PDF Export**: Generate professional PDFs instantly
- **ATS Optimized**: Templates designed to pass Applicant Tracking Systems

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/goncalojbsousa/EasyPeasyCV.git
cd EasyPeasyCV
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
cv-builder/
├── app/
│   ├── components/          # React components
│   │   ├── cv_templates/    # CV template components
│   │   └── ui/             # Reusable UI components
│   ├── contexts/           # React contexts
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── page.tsx            # Landing page
│   └── builder/            # CV builder page
├── public/                 # Static assets
└── README.md
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PDF Generation**: @react-pdf/renderer
- **State Management**: React Hooks
- **Icons**: Custom SVG icons

## 🌍 Internationalization

The application supports multiple languages:
- Portuguese (pt)
- English (en)
- Spanish (es)

Language switching is available in the header.

## 🎨 Templates

### Classic Template
Elegant and traditional design suitable for most industries.

### Modern Template
Clean and contemporary layout with a professional look.

### Creative Template
Original and expressive design for creative professionals.

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you find this project helpful, consider supporting it:

- ⭐ Star the repository
- 🐛 Report bugs
- 💡 Suggest new features
- ☕ [Buy me a coffee](https://ko-fi.com/easypeasycv)

## 🔗 Links

- [GitHub Repository](https://github.com/goncalojbsousa/EasyPeasyCV)
- [Issues](https://github.com/goncalojbsousa/EasyPeasyCV/issues)