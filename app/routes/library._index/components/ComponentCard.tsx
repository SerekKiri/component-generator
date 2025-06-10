import { Link } from "@remix-run/react";

export const ComponentCard = ({ title, id, createdAt }: { title: string, id: string, createdAt: string }) => {
    return (
        <Link to={`/library/${id}`} className="bg-white rounded-lg border border-primary-400 p-4 min-w-[250px] max-w-sm hover:border-primary-800 hover:bg-primary-200 transition-colors group">
            <h3 className="font-semibold mb-2 group-hover:text-primary-800 transition-colors">{title}</h3>
            <p className="text-sm text-gray-500">Created: {new Date(createdAt).toLocaleDateString()}</p>
        </Link>
    );
};