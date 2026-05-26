import { Terminal, Database, Server, Link, Code, CheckCircle } from 'lucide-react';

const CodeBlock = ({ code, language = 'bash' }: { code: string; language?: string }) => (
  <div className="bg-gray-900 rounded-xl overflow-hidden">
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
      <span className="text-xs font-medium text-gray-400">{language}</span>
      <Terminal className="h-3.5 w-3.5 text-gray-500" />
    </div>
    <pre className="p-4 text-sm text-green-400 overflow-x-auto whitespace-pre-wrap">{code}</pre>
  </div>
);

const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
      <span className="text-indigo-600">{icon}</span>
      {title}
    </h2>
    {children}
  </div>
);

export const BackendSetupPage = () => {
  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Backend Setup Guide</h1>
        <p className="text-gray-600">Complete guide to set up the backend and connect it to this frontend.</p>
      </div>

      <Section title="Tech Stack" icon={<Server className="h-5 w-5" />}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Backend', value: 'NestJS', color: 'bg-red-50 text-red-700 border-red-200' },
            { label: 'Database', value: 'PostgreSQL', color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { label: 'ORM', value: 'TypeORM', color: 'bg-purple-50 text-purple-700 border-purple-200' },
            { label: 'Auth', value: 'JWT + Bcrypt', color: 'bg-green-50 text-green-700 border-green-200' },
          ].map((item) => (
            <div key={item.label} className={`rounded-xl border p-4 text-center ${item.color}`}>
              <p className="text-lg font-bold">{item.value}</p>
              <p className="text-xs font-medium opacity-70 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Step 1: Create NestJS Backend" icon={<Terminal className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Run these commands in a separate terminal to create the backend:</p>
          <CodeBlock code={`# Install NestJS CLI
npm install -g @nestjs/cli

# Create new NestJS project
nest new store-rating-backend

# Navigate to project
cd store-rating-backend

# Install dependencies
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/jwt @nestjs/passport passport passport-jwt passport-local
npm install bcrypt class-validator class-transformer
npm install @nestjs/config
npm install -D @types/bcrypt @types/passport-jwt @types/passport-local`} />
        </div>
      </Section>

      <Section title="Step 2: Database Schema (PostgreSQL)" icon={<Database className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Create PostgreSQL database and run these SQL commands:</p>
          <CodeBlock language="sql" code={`-- Create database
CREATE DATABASE store_rating_db;

-- Users table
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(60) NOT NULL CHECK (LENGTH(name) >= 20),
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  address     VARCHAR(400) NOT NULL,
  role        VARCHAR(20) NOT NULL DEFAULT 'user' 
                CHECK (role IN ('admin', 'user', 'store_owner')),
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Stores table
CREATE TABLE stores (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(60) NOT NULL CHECK (LENGTH(name) >= 20),
  email         VARCHAR(255) UNIQUE NOT NULL,
  address       VARCHAR(400) NOT NULL,
  owner_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- Ratings table
CREATE TABLE ratings (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id    INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, store_id)  -- One rating per user per store
);

-- Indexes for performance
CREATE INDEX idx_ratings_store_id ON ratings(store_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_stores_owner_id ON stores(owner_id);`} />
        </div>
      </Section>

      <Section title="Step 3: NestJS Configuration" icon={<Code className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 font-medium">app.module.ts — Main module configuration:</p>
          <CodeBlock language="typescript" code={`import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'password',
      database: process.env.DB_NAME || 'store_rating_db',
      autoLoadEntities: true,
      synchronize: false, // Use migrations in production
    }),
    AuthModule,
    UsersModule,
    StoresModule,
    RatingsModule,
  ],
})
export class AppModule {}`} />

          <p className="text-sm text-gray-600 font-medium mt-4">main.ts — Enable CORS for frontend connection:</p>
          <CodeBlock language="typescript" code={`import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS - allow frontend origin
  app.enableCors({
    origin: 'http://localhost:5173',  // Your Vite frontend URL
    credentials: true,
  });
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  
  await app.listen(3000);
  console.log('Backend running at http://localhost:3000/api');
}
bootstrap();`} />
        </div>
      </Section>

      <Section title="Step 4: Key API Endpoints" icon={<Link className="h-5 w-5" />}>
        <div className="space-y-3">
          {[
            { method: 'POST', path: '/api/auth/login', desc: 'Login — returns JWT token + user info', color: 'bg-blue-100 text-blue-700' },
            { method: 'POST', path: '/api/auth/register', desc: 'Register normal user', color: 'bg-blue-100 text-blue-700' },
            { method: 'PUT', path: '/api/auth/password', desc: 'Update password (JWT required)', color: 'bg-yellow-100 text-yellow-700' },
            { method: 'GET', path: '/api/admin/stats', desc: 'Dashboard stats (admin only)', color: 'bg-green-100 text-green-700' },
            { method: 'GET', path: '/api/users', desc: 'List all users (admin only)', color: 'bg-green-100 text-green-700' },
            { method: 'POST', path: '/api/users', desc: 'Create user (admin only)', color: 'bg-blue-100 text-blue-700' },
            { method: 'GET', path: '/api/stores', desc: 'List all stores (all authenticated users)', color: 'bg-green-100 text-green-700' },
            { method: 'POST', path: '/api/stores', desc: 'Create store (admin only)', color: 'bg-blue-100 text-blue-700' },
            { method: 'POST', path: '/api/ratings', desc: 'Submit/update rating (user only)', color: 'bg-blue-100 text-blue-700' },
            { method: 'GET', path: '/api/store-owner/dashboard', desc: 'Store owner dashboard', color: 'bg-green-100 text-green-700' },
          ].map((ep) => (
            <div key={ep.path} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <span className={`text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap ${ep.color}`}>{ep.method}</span>
              <code className="text-xs font-mono text-gray-700 flex-shrink-0">{ep.path}</code>
              <span className="text-xs text-gray-500">{ep.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Step 5: Connect Frontend to Backend" icon={<Link className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Create a <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">.env</code> file in the frontend root:</p>
          <CodeBlock language=".env" code={`# Frontend .env file (create in project root)
VITE_API_URL=http://localhost:3000/api`} />
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">Auto-switching between Mock and Real Backend</p>
              <p className="text-sm text-green-700 mt-1">
                The frontend automatically uses <strong>mock data</strong> when <code>VITE_API_URL</code> is not set,
                and switches to the <strong>real backend</strong> when the env variable is defined.
                No code changes needed!
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Step 6: Authentication Flow" icon={<CheckCircle className="h-5 w-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 font-medium">Expected login response format from backend:</p>
          <CodeBlock language="json" code={`// POST /api/auth/login response
{
  "id": 1,
  "name": "System Administrator Account",
  "email": "admin@storerate.com",
  "address": "123 Admin Street...",
  "role": "admin",        // "admin" | "user" | "store_owner"
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`} />
          <p className="text-sm text-gray-600">The token is stored in <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">localStorage</code> and automatically sent as <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Authorization: Bearer TOKEN</code> header with every API request.</p>
        </div>
      </Section>
    </div>
  );
};
