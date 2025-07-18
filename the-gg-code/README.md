# The GG Code - Horse Racing Prediction App (Phase 2 Complete)

An AI-powered horse racing analysis platform that retrieves real-time race data, processes it with advanced AI models, and delivers actionable predictions through an intuitive web interface.

## 🎯 Current Status: Phase 2 Complete

**Phase 2** successfully integrates **Llama-3.3-70B-Instruct** (via OpenRouter) with **Brave Search API** and **Supabase** database, providing real race data analysis with AI processing.

### ✅ What's Working Now

- **🔍 Real Data Retrieval**: Live search of racing websites using Brave Search API
- **🤖 AI Processing**: Llama-3.3-70B-Instruct extracts structured race information  
- **💾 Data Storage**: Complete interaction logging in Supabase database
- **📊 Live Race Cards**: Real horse names, odds, jockey information
- **⚡ Real-time UI**: Loading states, error handling, API status monitoring
- **🌍 Timezone Aware**: Accurate time conversion for international races

## 🏗️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **AI/LLM**: Llama-3.3-70B-Instruct via OpenRouter API
- **Search**: Brave Search API for real-time race data
- **Database**: Supabase for interaction logging and storage
- **Styling**: Custom CSS with utility classes
- **Time Handling**: Moment.js with timezone support

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Clone the repository
git clone <repository-url>
cd the-gg-code

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### 2. API Configuration
Edit `.env` with your API keys:
```bash
REACT_APP_BRAVE_API_KEY=your_brave_api_key
REACT_APP_OPENROUTER_API_KEY=your_openrouter_api_key
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_KEY=your_supabase_key
```

**Get API Keys:**
- **Brave Search**: [api.search.brave.com](https://api.search.brave.com/)
- **OpenRouter**: [openrouter.ai](https://openrouter.ai/)
- **Supabase**: [supabase.com](https://supabase.com/)

### 3. Database Setup
Run the SQL schema in your Supabase project:
```sql
-- See supabase-schema.sql for complete setup
CREATE TABLE race_searches (
  id BIGSERIAL PRIMARY KEY,
  country TEXT NOT NULL,
  venue TEXT NOT NULL,
  -- ... (full schema in supabase-schema.sql)
);
```

### 4. Start Development
```bash
npm start
# App opens at http://localhost:3000
```

## 🎮 How to Use

### Step-by-Step Race Analysis

1. **Select Country**: Choose from 11 supported countries (US, UK, AU, etc.)
2. **Enter Venue**: Type venue name with auto-complete suggestions
3. **Set Date/Time**: DD/MM/YYYY and HH:MM format with timezone conversion
4. **Start Analysis**: Click to begin real-time data retrieval
5. **View Results**: See race card with horse details and AI insights

### Example Usage
```
Country: United Kingdom
Venue: Ascot
Date: 25/01/2024  
Time: 14:30
→ Searches for real Ascot race data
→ AI extracts horse names, odds, jockeys
→ Displays structured race card
→ Logs complete interaction to database
```

## 📊 Features

### Race Input Form
- **Country Auto-complete**: 11 countries with timezone detection
- **Venue Suggestions**: 23 major racing venues worldwide
- **Date/Time Validation**: DD/MM/YYYY and HH:MM format checking
- **Timezone Conversion**: Automatic user ↔ venue timezone handling
- **Real-time Validation**: Instant error feedback and correction

### AI-Powered Race Cards
- **Real Data**: Actual horse names, odds, and racing information
- **Top Selections**: AI-ranked Winner, Place, and Longshot picks
- **Complete Runner List**: All horses with detailed information
- **Confidence Scores**: AI assessment of each horse's chances
- **Professional Layout**: Clean, organized race card presentation

### Developer Monitoring
- **API Health**: Live connection status for all services
- **Rate Limiting**: Brave Search API usage tracking
- **Data Quality**: Assessment based on extracted information
- **Error Logging**: Comprehensive debugging information
- **Database Status**: Supabase connection and storage confirmation

## 🔧 Architecture

### Data Flow
```
User Input → Timezone Conversion → Search Query Generation
    ↓
Brave Search API → Trusted Racing Sources → Raw Web Results
    ↓  
Llama-3.3-70B-Instruct → Data Extraction → Structured Race Data
    ↓
Data Validation → UI Update → Supabase Storage
```

### API Integration
```typescript
// Multi-tier search strategy
1. Broad search: "horse racing {venue} {date} race card"
2. Trusted sources: Filter for racingpost.co.uk, timeform.com
3. Refined search: Site-specific queries if needed
4. LLM processing: Extract structured data from results
5. Data validation: Sanitize and validate all information
```

### Database Schema
```sql
race_searches (
  id, user_id, country, venue, date, time,
  user_timezone, race_timezone, search_query,
  api_response, llm_input, llm_output,
  api_status, rate_limits, data_quality,
  error_message, llm_brave_config, timestamp
)
```

## 🧪 Testing & Validation

### Real-World Performance
- **UK Races**: Excellent coverage via Racing Post, Timeform
- **US Races**: Good results for major tracks  
- **AU Races**: Solid data from Racing.com
- **Response Time**: 10-30 seconds typical
- **Success Rate**: Varies by venue popularity and date proximity

### Quality Assurance
- **Input Validation**: Comprehensive form checking
- **API Error Handling**: Graceful degradation on failures
- **LLM Response Parsing**: Robust JSON extraction
- **Data Sanitization**: Range validation for all metrics
- **Storage Reliability**: Non-blocking database operations

## 📈 Current Capabilities

### What Works Now ✅
- Real-time race data retrieval from major racing websites
- AI extraction of horse names, odds, jockey information
- Timezone-aware international race handling
- Complete interaction logging for analysis
- Professional UI with loading states and error handling
- Live API monitoring and status indicators

### Known Limitations ⚠️
- **AI Confidence Scores**: Currently placeholders (real algorithms in Phase 3)
- **Data Coverage**: Depends on web source availability
- **Rate Limits**: Subject to Brave Search API quotas
- **Prediction Logic**: No advanced racing analysis algorithms yet

## 🔄 Development Phases

### ✅ Phase 1: UI Foundation (Complete)
- Two-panel layout with form and race card
- Timezone handling and validation
- Modular component architecture
- Responsive design and dummy data

### ✅ Phase 2: API Integration (Complete)  
- Brave Search API for real data retrieval
- Llama-3.3-70B-Instruct for AI processing
- Supabase database for storage
- Error handling and monitoring

### 🔜 Phase 3: Advanced AI (Planned)
- Real prediction algorithms and analysis
- Historical data integration
- Performance tracking and analytics
- Enhanced confidence scoring

### 🔮 Future Phases
- Multi-user support and accounts
- Social features and tipster integration
- Official racing API integrations
- Mobile app development

## 🛠️ Development

### Project Structure
```
the-gg-code/
├── src/
│   ├── components/           # React components
│   │   ├── RaceInputForm.tsx # Left panel form
│   │   ├── RaceCard.tsx      # Right panel display  
│   │   └── DeveloperPanel.tsx# API monitoring
│   ├── utils/               # Utility functions
│   │   ├── apiClient.ts     # Brave + OpenRouter APIs
│   │   ├── supabaseClient.ts# Database integration
│   │   ├── constants.ts     # Countries and venues
│   │   ├── timezone.ts      # Time handling
│   │   └── validation.ts    # Form validation
│   ├── types/               # TypeScript interfaces
│   └── App.tsx             # Main application
├── supabase-schema.sql     # Database setup
├── .env.example           # Environment template
└── README.md             # This file
```

### Adding Features
1. **New Data Sources**: Extend `apiClient.ts` with additional search strategies
2. **Enhanced AI**: Improve LLM prompts and response parsing
3. **UI Components**: Add new components in the `components/` directory
4. **Database**: Extend schema and add new tables as needed

## 📝 Console Output

The application provides extensive debugging information:
```
Brave Search: Searching for "horse racing Ascot 2024-01-25 race card runners odds" in UK
Brave Search: Found 15 results
LLM: Calling Llama-3.3-70B-Instruct to parse search results
LLM: Extracted 8 valid horses
Supabase: Saving race search data...
App - Received race data: [8 horses with complete information]
```

## 🔐 Security & Privacy

- **API Keys**: Stored in environment variables (never committed)
- **Database**: Row Level Security enabled in Supabase
- **Data**: Race information only (no personal user data stored)
- **Logging**: Complete transparency with console output

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add comprehensive tests
4. Update documentation
5. Submit a pull request

For questions about the codebase or adding new features, check the extensive console logging for debugging information.

## 📄 License

This project is private and proprietary. All rights reserved.

---

**Current Status**: ✅ **Phase 2 Complete**  
**Functionality**: Real race data analysis with AI processing  
**Ready for**: Advanced prediction algorithms and enhanced features  
**Live Demo**: Fully functional with real API integrations
