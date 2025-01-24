import { getLatestBlogPosts } from "../utils/server-utils";

export async function LatestBlogPosts() {
  const posts = await getLatestBlogPosts();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Latest Blog Posts</h2>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="border-b pb-4 last:border-b-0">
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="text-sm text-gray-600">
              By {post.author.name} on{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
