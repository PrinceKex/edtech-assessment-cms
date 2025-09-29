import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to CMS</h1>
      <p className="text-gray-600 mb-6">This is the home page of your CMS application.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Create Content</h2>
          <p className="text-blue-700">Easily create and manage your articles and categories.</p>
        </div>
        
        <div className="p-6 bg-green-50 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Organize</h2>
          <p className="text-green-700">Use categories to keep your content organized.</p>
        </div>
        
        <div className="p-6 bg-purple-50 rounded-lg">
          <h2 className="text-xl font-semibold text-purple-800 mb-2">Publish</h2>
          <p className="text-purple-700">Publish your content with a single click.</p>
        </div>
      </div>
      
      <div className="mt-8">
        <Link 
          to="/articles" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
