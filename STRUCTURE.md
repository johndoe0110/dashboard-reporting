# Project Structure

Struktur folder yang telah diorganisir untuk reusable, scalable, dan production-ready.

## Folder Structure

```
src/
├── components/
│   ├── common/              # Reusable components
│   │   ├── Button.jsx       # Button component dengan variants
│   │   ├── Alert.jsx        # Alert component untuk notifications
│   │   └── DatePicker.jsx   # Date picker component
│   │
│   └── dashboard/           # Dashboard-specific components
│       ├── Header.jsx       # Dashboard header dengan date picker & actions
│       ├── KpiCard.jsx      # KPI card component
│       ├── KpiSection.jsx   # KPI section wrapper
│       ├── MetricCard.jsx   # Metric card dengan progress bar support
│       ├── BusinessMetrics.jsx    # Business metrics section
│       ├── SecondaryMetrics.jsx   # Secondary metrics section
│       ├── CampaignTable.jsx      # Campaign table untuk Facebook & TikTok
│       └── RoasAlert.jsx    # ROAS warning alert
│
├── hooks/                   # Custom React hooks
│   ├── useDateTime.js       # Hook untuk live time
│   └── useDatePicker.js     # Hook untuk date picker state
│
├── utils/                   # Utility functions
│   ├── dateUtils.js         # Date formatting utilities
│   └── formatters.js        # Number & currency formatters
│
├── constants/               # Constants & configurations
│   └── colors.js           # Color mapping untuk components
│
├── pages/                   # Page components
│   └── Dashboard.jsx       # Main dashboard page
│
├── App.jsx                  # Root component
└── main.jsx                 # Entry point
```

## Component Organization

### Common Components
Komponen yang bisa digunakan di berbagai bagian aplikasi:
- **Button**: Reusable button dengan variants (default, primary, secondary, outline)
- **Alert**: Alert component untuk notifications (warning, error, info, success)
- **DatePicker**: Date picker dengan "Today" button

### Dashboard Components
Komponen khusus untuk dashboard:
- **Header**: Header dengan title, date picker, live time, dan action buttons
- **KpiCard**: Card untuk menampilkan KPI dengan color coding
- **MetricCard**: Card untuk metrics dengan support progress bar dan warning icons
- **CampaignTable**: Table untuk menampilkan Facebook & TikTok campaigns dengan summary rows

## Hooks

- **useDateTime**: Hook untuk mendapatkan live time yang update setiap detik
- **useDatePicker**: Hook untuk manage date picker state dengan fungsi Today

## Utils

- **dateUtils**: Functions untuk format date (Indonesian format, short format, time format)
- **formatters**: Functions untuk format currency (Rupiah) dan numbers

## Constants

- **colors**: Color mapping untuk KPI cards dan metric cards

## Best Practices

1. **Separation of Concerns**: Components dipisah antara common (reusable) dan dashboard-specific
2. **Reusability**: Common components dibuat generic dengan props yang flexible
3. **Scalability**: Struktur folder memudahkan penambahan komponen baru
4. **Maintainability**: Utils dan constants dipisah untuk memudahkan maintenance
5. **Type Safety**: Ready untuk TypeScript migration jika diperlukan
