# E-Commerce Admin Dashboard  

A powerful and user-friendly admin dashboard for managing e-commerce platforms, built with **Next.js**, **TypeScript**, and **Tailwind CSS**. This project provides tools for product management, analytics, and seamless payment integration using **Stripe**.  

## Live Demo  
Experience the live project: [E-Commerce Admin Dashboard](https://iceadmin.vercel.app/)  

## Features  
✅ **Authentication** – Secured user authentication powered by **Clerk**.  
✅ **Analytics** – Visualize data with interactive charts using **Recharts**.  
✅ **Product Management** – Add, edit, and delete products effortlessly.  
✅ **Payment Integration** – Simplified transactions through **Stripe**.  
✅ **Responsive Design** – Styled with **Tailwind CSS** for mobile-first responsiveness.  
✅ **Image Upload** – Leverages **Cloudinary** for efficient image management.  

## Tech Stack  
- **Next.js** – Framework for fast, server-rendered React applications.  
- **TypeScript** – Adds type safety to the codebase.  
- **Tailwind CSS** – Utility-first CSS framework for rapid styling.  
- **Clerk** – User authentication and management.  
- **Prisma** – Database ORM for schema and data management.  
- **Stripe** – Payment processing and management.  
- **Recharts** – Interactive data visualization library.  
- Additional tools: `Cloudinary`, `Radix UI`, `React Hook Form`, `Zod`.  

## Getting Started  

Follow these steps to set up the project locally:  

### Prerequisites  
- **Node.js** (version 18 or higher)  
- **npm** or **yarn**  
- **A configured database** (refer to Prisma setup)  

### Installation  

#### 1. Clone the repository:  
```bash
git clone https://github.com/Icekid35/iceadmin.git
cd iceadmin
```
#### 2. Install dependencies:  
```bash
npm install
```
#### 3. Set up environment variables:  
- Create a `.env` file in the project root.  
- Add your database connection string, Clerk API keys, and Stripe API keys.  

#### 4. Generate Prisma client:  
```bash
npx prisma generate
```
#### 5. Start the development server:  
```bash
npm run dev
```

## Project Structure  
📁 **/pages** – Application routes and API endpoints.  
📁 **/components** – Reusable UI components.  
📁 **/prisma** – Database schema and migrations.  
📁 **/public** – Static assets like images and icons.  

## Deployment  
The project is deployed on **Vercel**.  

For deployment:  
- Configure `.env` variables on the **Vercel dashboard**.  
- Ensure the database and API services are live.  

## Contributing  
Contributions are welcome! 🚀  
1. Fork the repository.  
2. Create a feature branch.  
3. Submit a pull request.  

## License  
This project is licensed under the **MIT License**.  

## Acknowledgments  
- **[Next.js](https://nextjs.org/)**  
- **[Tailwind CSS](https://tailwindcss.com/)**  
- **[Prisma](https://www.prisma.io/)**  
- **[Clerk](https://clerk.dev/)**  
- **[Stripe](https://stripe.com/)**  
- **[Vercel](https://vercel.com/)**  
