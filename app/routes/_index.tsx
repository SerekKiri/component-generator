import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Reacta" },
    { name: "description", content: "Welcome to Reacta!" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary-500">Reacta</h1>
        <h4 className="text-xl mb-4">Welcome to <span className="font-semibold">Reacta</span>!</h4>
        <p className="mb-2 text-gray-700">
          Generate, preview, and share React components with the help of AI.
        </p>
        <p className="mb-6 text-gray-700">
          Sign up or log in to start generating your own components, chat with the model, and explore the community library.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login" className="px-6 py-2 rounded bg-primary-500 text-white font-semibold hover:bg-primary-600 transition">Login</Link>
          <Link to="/signup" className="px-6 py-2 rounded border border-primary-500 text-primary-500 font-semibold hover:bg-primary-500 hover:text-white transition">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
