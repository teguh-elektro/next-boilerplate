'use client'
// pages/signup.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add your signup logic here (e.g., API call to create a new user)
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      router.push('/login'); // Redirect to login page after signup
    } else {
      const data = await response.json();
      setError(data.error); // Assuming your API returns an error message
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-lg font-semibold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500">{error}</p>}
          <div className="mb-4">
            <label className="block mb-2" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Sign Up
          </button>
        </form>
        <div className="my-4 text-center">
          <p>Or</p>
          <button
            onClick={() => signIn('google')}
            className="w-full bg-red-600 text-white py-2 rounded mt-2"
          >
            Sign Up with Google
          </button>
        </div>
        <p className="mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

