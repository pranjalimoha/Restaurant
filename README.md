# Restaurant
Final Assignment for Software Engineering Project Management COSC6342 26132 - Software Engineering Project Management
Project Scope
In Scope
1.	User Access & Identity
•	Guest user reservation (no authentication required)
•	Registered user account creation and login
•	Secure authentication (JWT-based session handling)
•	User session persistence (stay logged in)
•	Logout functionality
•	Optional registration flow for guest users
•	Role-based access (guest, user, admin)

2.	User Profile & Loyalty System
•	User profile creation and management
•	Mailing and billing address management
•	“Same as mailing” billing checkbox logic
•	Preferred diner number auto-generation
•	Points accumulation system ($1 = 1 point)
•	View points balance
•	Preferred payment method storage
•	Profile editing and updates
•	Points tracking system ($1 = 1 point)
3.	Reservation Search & Booking
•	Display available tables
•	Real-time availability updates
•	Reservation creation (guest + registered users)
•	Reservation confirmation screen
•	Email confirmation system
•	Reservation modification
•	Guest user reservation functionality (no login required)
•	Reservation cancellation
•	Display available tables
•	Table search and availability checking by date, time, and party size
•	Admin dashboard for restaurant owners/managers
4.	Table Management & Allocation Engine
•	Table inventory management (2, 4, 6, 8 capacities)
•	Table availability tracking
•	Intelligent table allocation logic
•	Intelligent table combination algorithm (e.g., 4+4 for 8 guests)
o	2 + 6
o	4 + 4
•	Prevent overbooking
•	Reservation-to-multiple-table mapping
•	Manual override capability (admin)
•	Owner notification system for combined table reservations
•	Email confirmation system for reservations
5.	Payments & Reservation Policies
•	High-traffic day configuration (admin-defined + weekends)
•	Holding fee enforcement on high-traffic days
•	Credit card validation (Stripe integration)
•	Payment hold (not immediate charge)
•	No-show policy enforcement
•	No-show penalty tracking ($10 minimum)
•	User agreement acknowledgment for fees
6.	Notifications & Communication
•	Email notifications (reservation confirmation)
•	SMS notifications (optional)
•	Reservation reminders:
o	24-hour reminder
o	2-hour reminder
•	Admin alerts for special cases (table combinations)
•	Failure/retry notification system

7.	Admin / Owner Features
•	View all reservations
•	Filter reservations by:
o	date
o	time
o	user
•	View table assignments
•	Override table assignments
•	Manage high-traffic dates
•	Manage users
•	View analytics dashboard
8.	Reporting & Analytics
•	Reservation trends reporting
•	Reporting and analytics for reservation patterns
•	Peak hours analysis
•	No-show rate tracking
•	Revenue impact insights
•	Table utilization metrics
9.	Performance & Scalability
•	Optimized database queries and indexing
•	Caching frequently accessed data (Redis)
•	Load handling for peak traffic
•	Queue system for high request volume
•	CDN for static assets
•	High-traffic day identification and holding fee enforcement
•	Credit card validation for high-traffic reservations
•	No-show penalty notification ($10 minimum charge)
10.	Security & Compliance
•	Secure authentication (JWT, bcrypt)
•	Input validation (Zod)
•	Rate limiting
•	HTTPS enforcement
•	PCI compliance for payment data
•	Role-based authorization
11.	Maintenance & Support
•	Global in-app bug reporting feature (IconButton)
•	Bug report form with:
o	description
o	screenshot upload
o	page context
•	Ticket creation system
•	Admin view of reported issues
•	Status tracking for defects
•	Email confirmation for submitted issues

12.	Real-Time System Features
•	Real-time table availability updates (Socket.IO)
•	Real-time reservation updates
•	Live admin dashboard updates
•	Conflict detection in real time
Risk analysis and recommendations
This section identifies potential risks to project success and provides mitigation strategies to minimize their impact. The risks are divided into two distinct categories which assess their potential impact and likelihood of occurrence.
Data Security and Privacy Breach
Impact: High
User data including personal information, payment details, and reservation history could be compromised.
Mitigation Strategies:
•	The organization must establish end-to-end encryption protocols which protect all confidential information. 
•	The system requires authentication through both OAuth 2.0 and JWT.
•	The organization must conduct security audits together with penetration testing on a regular basis. 
•	The organization needs to implement measures which ensure compliance with both GDPR and PCI-DSS requirements. 
•	The organization needs to implement multi-factor authentication, which will protect all administrator accounts.

Double Booking Incidents
Impact: High
Probability: Medium
System error could result in same table being booked for multiple parties at the same time.
Mitigation Strategies:
•	The system needs to establish database-level locking systems as its primary requirement. 
•	The system should use transaction isolation technology to stop race condition problems. 
•	The system requires validation of availability status through real-time methods before it completes the confirmation process. 
•	The system provides automatic conflict identification together with automatic conflict resolution capabilities.
•	The system enables staff members to manually take control while maintaining complete audit trails of their activities.

Performance Degradation During Peak Hours
Impact: High
Probability: High
System slowdown during holidays and weekend peak booking times (e.g., Valentine's Day, New Year's Eve).
Mitigation Strategies:
• The system requires load balancers to perform horizontal scaling operations. 
• The system needs Redis caching layers to store data that users access most frequently. • The process requires two activities which are database query optimization and database index creation.
 • The system uses a content delivery network to distribute its static resources. 
• The system needs a queue mechanism to process incoming requests that exceed normal operating limits.

Table Combination Algorithm Errors
Impact: Medium
Probability: Medium
Incorrect table combinations could result in suboptimal seating arrangements or failed reservations.
Mitigation Strategies:
•	Complete algorithm testing requires execution of unit tests and integration tests and extreme-scenario tests. 
•	All system combinations must be validated through curated edge-case datasets and simulated restaurant-day scenarios. 
•	The system requires human-in-the-loop failover for complex cases which will include staff override capabilities and reasoning logs.
•	The system requires real-time conflict detection systems to stop overlapping or invalid combination scenarios from happening. 
•	The system needs continuous monitoring of ML models which requires retraining of ML models to keep their accuracy intact. 
•	The organization needs to establish a system that allows staff and customers to provide feedback which will support ongoing development processes. 
•	Safe deployments require organizations to use version control systems that include rollback features. 
•	The system requires monitoring and alerting systems to detect unusual patterns of error occurrences.

No-Show Rate Impact on Revenue
Impact: Medium
Probability: High
High no-show rates could significantly impact restaurant revenue, especially during peak times.
Mitigation Strategies:
•	The organization needs to create a holding fee system which will apply during peak traffic periods. 
•	The system requires automatic reminder notifications which will be sent at 24-hour and 2-hour intervals before scheduled events.
•	The organization needs to establish a no-show penalty system which will impose increasing penalties for repeated offenses. 
•	The system requires the development of a reputation score system which will assess the standing of registered users. 
•	The system needs to establish a waitlist notification system which will inform users about available last-minute openings.

Third-Party Service Dependencies
Impact: Medium
Probability: Low
Email service, payment gateway, or hosting provider outages could disrupt operations.
Mitigation Strategies:
•	The system requires protection from email service outages through the implementation of multiple email service providers which will function as backup systems. 
•	The system needs to establish retry mechanisms which will follow the pattern of exponential backoff. 
•	The organization has established service-level agreements (SLA) to govern its relationships with its service providers. 
•	The system needs to provide two functions which include continuous monitoring and instant alert generation. 
•	The system uses backup communication channels which include admin dashboard notifications.

User Adoption and Training Challenges
Impact: Medium 
Probability: Medium 
Staff resistance to new system or poor user experience leading to low adoption rates.
Mitigation Strategies:
•	Conduct user research and usability testing
•	Provide comprehensive training sessions for staff
•	Create video tutorials and knowledge base
•	Implement gradual rollout with pilot locations
•	Gather feedback and iterate quickly on UX improvements

Implementation plan
Development Methodology
Agile Scrum Framework
The project will follow Agile Scrum methodology with 2-week sprints to ensure iterative development, continuous feedback, and flexibility to adapt to changing requirements.
Sprint Structure:
•	Sprint duration: 1 week 
•	Sprint Planning: Every Monday morning (1 hour) 
•	Daily Standups: 15 minutes each day 
•	Mid-Sprint Review / Checkpoint: Wednesday (15–30 minutes) 
•	Sprint Review: Friday afternoon (45 minutes) 
•	Sprint Retrospective: Friday afternoon (45 minutes)
Key Practices:
•	Continuous integration/continuous deployment (CI/CD)
•	Test-driven development (TDD)
•	Code reviews for all pull requests
•	Pair programming for complex features
•	Automated testing at all levels

Technology Stack
Frontend
•	React.js 18+ with TypeScript for building scalable, type-safe UI components 
•	Vite as the development server and build tool 
•	React Router DOM for client-side routing 
•	Material UI (MUI) for the primary design system 
•	CSS Modules for component-level styling 
•	Zustand for lightweight state management 
•	React Hook Form + Zod for form handling and validation 
•	Axios + React Query for API requests and caching 
•	Stripe.js + React Stripe.js for payment UI 
•	Socket.IO Client for real-time updates 
Backend
•	Node.js 20 LTS with Express.js for the server framework 
•	MySQL 8.0+ as the relational database 
•	Prisma ORM for database access, migrations, and schema management 
•	Redis for caching and session optimization 
•	JWT + bcrypt for secure authentication 
•	Zod for server-side schema validation 
•	Socket.IO for WebSocket communication 
•	Stripe API for payment holds and processing 
Infrastructure / DevOps
•	Render for hosting (Static frontend, backend web service, managed MySQL, managed Redis) 
•	Docker for containerized local development 
•	GitHub Actions for automated CI/CD pipelines 
•	PM2 for process management 
•	Datadog for monitoring and application insights 
Testing
•	Vitest for unit and integration tests 
•	React Testing Library for UI component testing 
•	Supertest for backend API testing 
•	Playwright for end-to-end testing 

External Services
•	SendGrid for transactional emails 
•	Twilio for SMS notifications 
•	Stripe for payment holds and charges

Project schedule 
Project Schedule
The project is planned across six weeks, aligned with the academic deadline of May 8, 2026. Since the development team consists of two members, the schedule focuses on manageable weekly goals, clear task division, and iterative delivery. Each sprint is one week long, and the final phase is dedicated to testing and deployment.
Timeline Overview
Total Duration: 6 weeks
Team Size: 2 developers
Sprints: 5 development sprints + final QA and deployment phase
Go-Live Target: May 8, 2026
Week 1 (March 25 – March 31)
Sprint 0 – Project Setup and Kickoff
Objective: Establish foundational setup to begin development.
Deliverables:
•	Environment setup (Node.js, Vite, Prisma, MySQL) 
•	GitHub repository with branching strategy 
•	CI/CD setup using GitHub Actions 
•	Docker configuration 
•	Environment variables setup (Stripe, SendGrid, Twilio) 
•	Basic frontend and backend folder structure 
•	Task distribution between team members 
Week 2 (April 1 – April 7)
Sprint 1 – Core Architecture and Infrastructure
Objective: Build the core structure of the backend and frontend.
Deliverables:
•	Prisma database schema and initial migrations 
•	API structure (controllers, routes, services) 
•	Authentication setup (JWT, bcrypt, validation) 
•	Base React application with Material UI 
•	Zustand global state initialization 
Week 3 (April 8 – April 14)
Sprint 2 – User and Account Management
Objective: Implement user-related functionality.
Deliverables:
•	User registration with Zod validation 
•	Login and logout using JWT 
•	Profile management 
•	Points system foundation 
•	Email verification and notifications using SendGrid 
•	SMS alerts using Twilio 
•	Basic Socket.IO integration 
Week 4 (April 15 – April 21)
Sprint 3 – Reservation Flow
Objective: Build the core reservation module.
Deliverables:
•	Table availability search 
•	Reservation creation workflow 
•	Basic table allocation logic 
•	Guest reservation flow 
•	Date and time picker integration using Material UI 
•	API validation using Zod 
•	Initial real-time updates using Socket.IO 
Week 5 (April 22 – April 28)
Sprint 4 – Reservation Engine and Admin Features
Objective: Implement system logic and administrative functionality.
Deliverables:
•	Advanced table combination algorithm 
•	Full real-time availability updates 
•	Stripe payment hold integration 
•	Reservation notifications via email and SMS 
•	Admin dashboard with reservation and user management features 
Week 6 (April 29 – May 5)
Sprint 5 – Final Features and Optimization
Objective: Complete remaining features and optimize performance.
Deliverables:
•	High-traffic day configuration 
•	No-show penalty logic 
•	Reservation modification and cancellation features 
•	Reporting dashboard 
•	Redis caching 
•	UI and UX refinements 
Final Phase (May 6 – May 8)
Testing, Quality Assurance, and Deployment
Objective: Prepare final submission, stabilize the system, and deploy.
Deliverables:
•	Unit tests using Vitest 
•	Component tests using React Testing Library 
•	API tests using Supertest 
•	End-to-end tests using Playwright 
•	Performance improvements 
•	Security review (JWT hardening, validation, rate limiting) 
•	Deployment to Render 
•	Final documentation and demonstration video
Solution architecture (diagram & discuss each component/module)
 
2. Layered Architecture (Technical System Design)
The layered architecture diagram represents the internal structure of the system and shows how different components interact to process user requests. The system follows a multi-layered design that separates responsibilities into distinct modules.
Presentation Layer (Frontend)
The presentation layer is responsible for all user interface interactions. It includes pages such as login, reservation search, table selection, payment, and confirmation. This layer collects user input, performs validation, and sends requests to the backend. It also displays real-time updates such as available tables and reservation confirmations.
Service Layer (Backend API)
The service layer acts as the entry point for all client requests. Built using Node.js and Express, it handles HTTP requests, validates data, and routes requests to the appropriate controllers. This layer ensures secure communication between the frontend and the business logic.
Business Layer (Core Logic)
The business layer contains the core functionality of the system. It includes services such as reservation processing, table allocation, transaction handling, and notification services. This layer is responsible for implementing critical logic such as table combination, preventing double bookings, enforcing high-traffic rules, and applying no-show penalties.
Data Access Layer
The data access layer manages communication with the database through repository patterns. It handles queries related to users, reservations, tables, and transactions. This abstraction ensures that the business logic remains independent of database implementation details.
Data Layer (Database)
The data layer stores all persistent data using a MySQL database. It includes entities such as users, reservations, tables, and transactions. Relationships between these entities ensure data integrity and support features such as multi-table reservations and loyalty point tracking.
 
High-Level System Flow (User Interaction Perspective)

The flow diagram represents the system from the user’s perspective and illustrates how a guest or registered user interacts with the application to complete a reservation.
The process begins when the user opens the application and chooses to either log in as a registered user or continue as a guest. This design supports flexibility by allowing users to make reservations without requiring account creation.
Once inside the system, the user navigates to the reservation page and enters personal details such as name, phone number, email, date, time, and number of guests. The system then processes this input and queries the database to determine table availability.
If a table of the requested size is not available, the system dynamically suggests combinations of tables (e.g., 4+4 or 2+6). This reflects the intelligent table allocation logic defined in the system requirements. Guest users are optionally prompted to register before completing the reservation, which supports user retention without disrupting the booking flow.
The system also applies business rules during this process, such as identifying high-traffic days, requiring a credit card for reservation holds, and notifying users of no-show penalties. Finally, the user completes the reservation, and a confirmation is displayed and sent via email.
This diagram focuses on user experience and system behavior, showing how inputs are collected, processed, and result in a completed reservation.
 
Testing Plan
Testing Plan
The restaurant reservation system will follow a multi-level testing strategy to ensure reliability, accuracy, and performance. Testing will be conducted throughout the development lifecycle using both automated and manual approaches.
Unit Testing
Unit tests will validate individual components and functions in isolation.
• Frontend components will be tested using Vitest and React Testing Library
• Backend logic (controllers, services) will be tested using Vitest
• Focus areas:
o Form validation (Zod schemas)
o Table combination logic
o Points calculation
o High-traffic day detection
Integration Testing
Integration testing ensures that different modules work together correctly.
• API endpoints tested using Supertest
• Database interactions validated through Prisma
• Focus areas:
o Reservation creation flow
o User authentication (JWT)
o Payment processing with Stripe (mocked)
o Email/SMS triggering
Performance Testing
Performance testing ensures the system can handle peak loads, especially during high-traffic periods such as holidays and weekends.
• Simulate concurrent users making reservations
• Test database performance under load
• Ensure no system crashes during peak usage
Security Testing
Security testing ensures protection of user data and system integrity.
• Validate authentication and authorization (JWT)
• Test password encryption (bcrypt)
• Input validation using Zod (prevent injection attacks)
• Secure payment handling (Stripe PCI compliance)
Acceptance Criteria Validation
Each feature will only be considered complete when:
• It passes all unit, integration, and E2E tests
• It meets defined acceptance criteria
• It is reviewed and approved during sprint review
• It is validated in a staging environment before deployment
Frontend Performance
• Metric: Initial page load time
Tool: Lighthouse, Chrome DevTools
Measurement method: Run Lighthouse audits on the reservation page and login page, then compare results before and after optimizations
Target: Under 2 seconds on standard broadband
• Metric: Time to interactive / responsive UI
Tool: Lighthouse, Chrome DevTools Performance tab
Measurement method: Record browser performance traces and confirm that the reservation page becomes usable quickly after load
Target: Fast enough for user interaction without noticeable lag
• Metric: Render performance during navigation
Tool: Chrome DevTools Performance tab
Measurement method: Profile route changes between login, reservation, and confirmation pages and check for excessive scripting or re-rendering
Target: Smooth transitions with no major frame drops
Backend Performance
• Metric: API response time
Tool: Datadog, Supertest timing, backend logs
Measurement method: Measure average response time for endpoints such as login, reservation search, and reservation creation
Target: Under 300 ms for normal requests
• Metric: Reservation transaction speed
Tool: Backend logs, Prisma query logs
Measurement method: Track how long it takes to validate availability, assign tables, and save the reservation
Target: Reservation processing completes quickly and consistently
Quality Measurement Plan
To ensure high quality, the system will be evaluated using measurable metrics:
Functional Quality
• All core features meet requirements
• Acceptance criteria for user stories are satisfied
• Reservation logic (including table combinations) is accurate
Performance Metrics
• Page load time < 2 seconds
• API response time < 300 ms
• System supports concurrent users without failure
Reliability
• System uptime target: 99.9%
• No data loss during transactions
• No double bookings
Usability
• Simple and intuitive user interface
• Minimal steps to complete reservation
• Responsive design across devices
Defect Rate
• Low number of critical bugs in production
• Bugs tracked and resolved through ticketing system
• Continuous monitoring and quick resolution
Continuous Quality Assurance
Quality will be maintained through continuous processes:
• Automated testing integrated into CI/CD pipeline (GitHub Actions)
• Code reviews for all pull requests
• Continuous monitoring using tools such as Datadog
• Logging and error tracking for production issues
• Regular updates and performance optimization
 
Deployment Plan
Deployment Strategy: Blue-Green Deployment
Production uses a Blue-Green strategy to achieve zero downtime and fast rollback.
Process:
Deploy the new release to the Green environment.
Run smoke tests on Green.
Gradually shift traffic from Blue → Green (10% → 25% → 50% → 100%).
Continuously monitor error rates, latencies, and performance graphs.
Finalize cutover when all metrics are healthy.
Keep Blue running for 24 hours as a standby.
Decommission Blue after confirming deployment stability.

CI/CD Pipeline Workflow
Code Checkout – Pull latest code from GitHub
Dependency Installation – Install npm packages
Linting – Run ESLint for code quality checks
Type Checking – Execute TypeScript compiler checks
Unit Tests – Run Jest test suite with coverage
Build Application – Compile and bundle frontend + backend
Security Scan – Run npm audit + OWASP dependency checks
Docker Build – Build Docker images for all services
Push to Registry – Push images to container registry
Deploy to Target – Deploy to the selected environment
Health Check – Verify application health and service readiness
Smoke Tests – Validate core functionality post-deployment

 
Maintenance plan (who will maintain and how customers log defects)
After deployment, the reservation system will require ongoing maintenance to ensure it remains reliable, secure, and easy for customers to use. Maintenance will include correcting defects, applying updates, monitoring performance, handling customer-reported issues, and improving the system over time.

The system should be maintained by a small support and development team made up of:
•	Application Support / Help Desk: receives customer defect reports and answers basic questions

•	Developer(s): fix defects, patch issues, and implement maintenance updates

•	Database / System Administrator: monitors server health, backups, and database performance

•	Project Manager or Product Owner: prioritizes defects and enhancement requests
A strong approach is to place an icon button with a bug icon in a location that is always accessible, such as:
•	the top navigation bar
•	the sidebar
•	a floating action button visible across pages
After the icon button has been clicked a Dialog or Modal will appear with a form as the content requesting client’s personal information on the bug. 
•	Some ideas on the personal information would be: 
Name
•	Email
•	Reservation ID, if applicable
•	Page or screen where problem occurred
•	Short description of the issue
•	Replication Steps taken before the issue happened
•	Screenshot upload option
•	timestamp
•	Severity level dropdown:
o	Low
o	Medium
o	High
o	Critical

The reservation system will be maintained by the application support team, QA testers, developers, and system administrators. Customers will be able to log defects directly within the application through a bug-reporting icon button placed in the navigation bar or sidebar, so it is accessible from any screen. When selected, the button will open a defect report form where users can describe the issue, attach screenshots, and provide relevant reservation details. Each submission will create a support ticket for review and prioritization. The maintenance team will classify defects by severity, assign them for correction, test the fix, and deploy updates during scheduled maintenance windows. In addition to corrective maintenance, the team will perform adaptive, perfective, and preventive maintenance through software updates, database tuning, security patching, and performance monitoring.

OR

Maintenance Plan:
The reservation system needs continuous maintenance work after its deployment to guarantee its dependable and secure and user-friendly operation. The maintenance process will address system errors and implement software updates while performance tracking and user issue resolution will be conducted.

Maintenance Team:
Developers (Christopher Blanco and Pranjali Moharkar): Fix defects, apply updates, optimize performance, and handle all maintenance tasks.
By interacting together, the group would collectively ascertain review, ranking, prioritizing, and resolution of defects and additional enhancements.
Customer Defect Logging:
Users can report issues using the bug-reporting button which appears in the navigation bar and sidebar and functions as a floating action button that users can access from any page. When the button is clicked the modal form will start collecting the following data:

•	Name and Email
•	Reservation ID (if applicable)
•	Page or screen where the issue occurred
•	Short description of the problem
•	Steps to reproduce the issue
•	Screenshot upload option
•	Timestamp
•	Severity level (Low, Medium, High, Critical)

Each submission will create a defect record in a shared tracking tool (e.g., Trello, GitHub Issues, or a spreadsheet). The maintenance workflow will include:

Reviewing and classifying defects by severity.
Assigning and fixing defects.
Testing fixes and deploying updates during scheduled maintenance windows.
Monitoring system performance, security, and backups continuously.

The team will use adaptive maintenance and perfective maintenance and preventive maintenance to maintain system efficiency and security through their work on updates and database tuning and security patching and performance monitoring activities.
<img width="468" height="644" alt="image" src="https://github.com/user-attachments/assets/de85730d-dbab-473f-9cde-66862bd08784" />
