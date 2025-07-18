# The GG Code - Horse Racing Prediction App (Phase 1)

An AI-powered horse racing analysis platform that streamlines betting research through real-time data retrieval and intelligent predictions.

## Phase 1 Overview

This is the **Phase 1** implementation focusing solely on the **User Interface**. The backend integration with APIs and AI models will be implemented in subsequent phases.

### Features Implemented in Phase 1

- ✅ **Two-Panel Layout**: Input form (left) and race card display (right)
- ✅ **Race Input Form** with auto-complete functionality
  - Country selection with timezone awareness
  - Venue input with suggestions
  - Date and time inputs with validation
  - Timezone conversion display
- ✅ **Race Card Display** with dummy data
  - Top 3 selections (Winner, Place, Longshot)
  - Full runner list ordered by AI confidence
  - Detailed horse information (odds, jockey, trainer, etc.)
- ✅ **Developer Panel** for debugging indicators
- ✅ **Responsive Design** for desktop and mobile
- ✅ **Form Validation** with error messages
- ✅ **Modular Component Architecture**

### Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Custom CSS (Tailwind-like utility classes)
- **Time Handling**: Moment.js with timezone support
- **Build Tool**: Create React App
- **Package Manager**: npm

### Project Structure

```
the-gg-code/
├── src/
│   ├── components/
│   │   ├── RaceInputForm.tsx     # Left panel input form
│   │   ├── RaceCard.tsx          # Right panel race display
│   │   └── DeveloperPanel.tsx    # Bottom developer indicators
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── utils/
│   │   ├── constants.ts          # Countries and venues data
│   │   ├── dummyData.ts          # Placeholder race data
│   │   ├── timezone.ts           # Timezone handling functions
│   │   └── validation.ts         # Form validation logic
│   ├── App.tsx                   # Main application component
│   ├── index.css                 # Global styles
│   └── index.tsx                 # Application entry point
├── public/
├── package.json
└── README.md
```

### Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

3. **Build for Production**
   ```bash
   npm run build
   ```

### Key Features Demonstrated

#### 1. Race Input Form
- **Country Auto-complete**: Type to filter countries with timezone detection
- **Venue Suggestions**: Built-in list of major racing venues worldwide
- **Date/Time Validation**: DD/MM/YYYY and HH:MM format validation
- **Timezone Awareness**: Automatic conversion between user and race venue timezones

#### 2. Race Card Display
- **Top Selections**: Winner, Place, and Longshot recommendations
- **Full Runner List**: All horses sorted by AI confidence scores
- **Comprehensive Data**: Odds, jockey, trainer, owner, and analysis scores

#### 3. Developer Panel
- **API Health Monitoring**: Connection status indicators
- **Rate Limiting**: Brave Search API usage tracking
- **Data Quality**: Assessment of retrieved information
- **Console Logging**: All interactions logged for debugging

### Dummy Data

Phase 1 uses realistic dummy data to demonstrate the UI:
- 8 horses with varied odds (3/1 to 20/1)
- AI confidence scores (55% to 85%)
- Track suitability scores
- Professional jockey and trainer names
- Price analysis ratings (1-10 scale)

### Form Validation

- **Required Fields**: All inputs must be filled
- **Date Format**: Must match DD/MM/YYYY pattern
- **Time Format**: Must match HH:MM (24-hour) pattern
- **Real-time Feedback**: Errors clear as user corrects them

### Responsive Design

- **Desktop**: Two-panel side-by-side layout
- **Mobile**: Stacked single-column layout
- **Touch-Friendly**: Appropriate button and input sizes
- **Visual Indicators**: Mobile view notification badge

### Console Output

The application logs comprehensive information for debugging:
- Form submissions and validation results
- Timezone detection and conversion
- Developer panel indicator updates
- User interactions and state changes

### Future Phases (Not Implemented)

❌ **Backend Integration**: Brave Search API and Llama Instruct LLM  
❌ **Database Storage**: Supabase for data persistence  
❌ **Real-time Data**: Live race cards and odds  
❌ **AI Predictions**: Actual machine learning analysis  
❌ **Advanced UI**: Glassmorphism design and dark mode  
❌ **Social Features**: User accounts and tipster integration  

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Development Notes

- **Phase 1 Focus**: UI/UX implementation only
- **No API Calls**: All data is static/dummy
- **Console Logging**: Extensive debugging information
- **Modular Design**: Easy to extend for future phases
- **Type Safety**: Full TypeScript implementation

### Running the Application

1. The application starts with a clean two-panel interface
2. Fill in the race details in the left panel
3. Click "Start Analysis" to load dummy race data
4. View the race card with top selections and full runner list
5. Check the developer panel for system status indicators
6. All interactions are logged to the browser console

### Contributing

This is Phase 1 of a multi-phase project. Future contributions will focus on:
- API integration and data persistence
- AI model implementation
- Enhanced UI features
- Performance optimization

For questions or issues with Phase 1, please check the console logs for detailed debugging information.
