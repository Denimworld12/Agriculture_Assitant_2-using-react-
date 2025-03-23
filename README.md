🌾 Agriculture Assistant Platform
The Agriculture Assistant Platform is a dual-site system designed to empower farmers and connect them directly with consumers while promoting sustainable agriculture practices. The platform facilitates seamless crop trading, offers farming resources, and keeps farmers updated with government news, schemes, and price trends.

🚀 Key Features
1. Dual-Site System
For Farmers:

Farmers can upload and list crops directly to the marketplace without third-party involvement.

Access farming equipment, fertilizers, and rent tractors based on area feasibility.

Daily government news and scheme updates related to agriculture.

View past crop price trends and get recommendations for the best time to sell.

For Users:

Users can explore the marketplace to buy crops, groceries, and farming products.

Filter and sort crops based on categories, price range, location, and other criteria.

View detailed crop information, including the farmer’s contact details for direct communication.

Bulk discounts apply automatically based on quantity, encouraging bulk purchases.

2. Intelligent Price Offers & Bulk Discounts
Dynamic pricing system that offers:

Per kg price for small quantities.

Automatic discount for bulk purchases (e.g., price reduction for 10kg or more).

3. Delivery Cart System with Farmer Contact
Users can add multiple items to their cart and purchase them simultaneously.

Delivery handled directly between farmers and users with farmer contact details provided.

4. Government News & Schemes Section
Displays real-time updates on agriculture-related government schemes, subsidies, and price trends.

Daily news updates fetched using APIs to keep farmers informed about policy changes and opportunities.

5. Crop Price History & Insights
Section to view historical price data of crops.

Provides insights on the best time and place to buy crops.

Sends alerts to users and farmers for price fluctuations.

6. Equipment & Fertilizer Rentals for Farmers
Farmers can access tractors and farming equipment for rent based on area feasibility.

Rental data dynamically updated to ensure equipment availability.

7. User & Farmer Portfolio Management
Separate portfolio pages for farmers and users.

Allows users to update their personal details and manage account information.

Farmers can manage their crop listings, view order history, and update their profile.

8. Multilingual Support
The platform supports multiple languages, including Hindi, Marathi, and more.

Provides seamless user experience across diverse regions.

9. Admin Panel for Centralized Control
A dedicated admin panel to manage and monitor platform activity.

Allows managing user data, crop listings, news updates, and marketplace interactions.

10. Authentication with Auto-Redirect
If a user stays on the homepage for 10 seconds without logging in, they are prompted to log in.

Seamless login/signup flow with secure authentication.

🛠️ Tech Stack
🎨 Frontend
HTML, CSS, JavaScript

EJS Templates with responsive design and dynamic rendering

Axios for API requests

Bootstrap for consistent and clean UI/UX

Multilingual support with language switcher

⚡ Backend
Node.js with Express.js

RESTful APIs for seamless communication

Axios for fetching government data dynamically

📦 Database
MongoDB for managing user, farmer, crop, and transaction data

Admin panel for backend management

📚 Project Structure
bash
Copy code
/agriculture-assistant
├── /public
│   ├── /css
│   └── /js
├── /views
│   ├── /farmer
│   ├── /user
│   ├── /partials
│   └── /admin
├── /routes
│   ├── farmerRoutes.js
│   ├── userRoutes.js
│   └── adminRoutes.js
├── /controllers
│   ├── farmerController.js
│   ├── userController.js
│   └── adminController.js
├── /models
│   ├── Farmer.js
│   ├── User.js
│   └── Crop.js
├── server.js
└── README.md
📖 Usage Instructions
1. Clone the Repository
bash
Copy code
git clone 
cd agriculture-assistant
2. Install Dependencies
bash
Copy code
npm install
3. Configure Environment Variables
Create a .env file and add required configuration values:

ini
Copy code
PORT=3000
DB_URI=mongodb://localhost/agriculture-assistant
API_KEY=your_gov_api_key
4. Run the Application
bash
Copy code
node server.js
The application runs on http://localhost:3000

🔐 Authentication & Permissions
Secure user authentication with sessions.

Separate permissions for users, farmers, and admins.

📊 Data Flow & Security
RESTful API ensures smooth data transfer.

MongoDB stores and protects user data with necessary constraints.

Admin panel monitors and regulates all platform interactions.

🌐 Admin Panel Features
Manage farmers and users.

Update crop pricing and listings.

Monitor platform activity and news updates.

🎨 UI/UX Design Guidelines
Clean and intuitive UI inspired by government websites.

Navbar with profile details and language switcher.

Consistent header and footer for all pages.

Integrated Google Maps and charts for crop price insights.

📣 Contributors
👨‍💻 Nikhil Gupta – Node.js Developer,Backend

🌾 Shivam Gupta – Backend 

📚 Umed Indulkar – UI Designer

📊 Abhishek Jaiswar – Database 

📝 Future Enhancements
AI-powered crop recommendations.

Fraud detection in uploaded listings.

Integration of payment gateways for seamless transactions.

📧 Contact
For any queries, reach out to nikhilrakeshg@gmail.com.



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
