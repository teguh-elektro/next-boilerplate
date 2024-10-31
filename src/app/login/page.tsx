"use client"; // Ensure this is at the top

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission

        const result = await signIn('credentials', {
            redirect: false, // Prevent automatic redirection
            email,
            password,
        });

        if (result?.error) {
            setError(result.error); // Set error if there is one
        } else {
            router.push('/'); // Redirect to home after successful login
        }
    };

    const handleGoogleLogin = () => {
        signIn('google', { callbackUrl: '/' }); // Redirect to home after Google login
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-80">
                <h2 className="text-lg font-semibold mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p className="text-red-500">{error}</p>}
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
                        Login
                    </button>
                </form>
                <div className="my-4 text-center">
                    <p>Or</p>
                    <button
                        onClick={() =>handleGoogleLogin()}
                        className="w-full bg-red-600 text-white py-2 rounded mt-2"
                    >
                        Login with Google
                    </button>
                </div>
                <p className="mt-4">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-blue-600">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
