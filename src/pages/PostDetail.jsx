import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios
      .get(`${config.apiUrl}/api/Posts/${id}`)
      .then((res) => setPost(res.data))
      .catch(() => setPost(null));
  }, [id]);

  if (post === null) return <div className="p-4">Không tìm thấy bài viết.</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold">
              {post.userName?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <div className="font-semibold text-gray-800">{post.userName}</div>
              <div className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleString("vi-VN")}
              </div>
            </div>
          </div>
          <div className="whitespace-pre-line text-gray-800 border-t border-gray-200 pt-3">
            {post.content}
          </div>
          {post.imageUrls?.length > 0 && (
            <div className="flex justify-center border-t border-gray-200 pt-3">
              {post.imageUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  className="max-w-full h-96 object-contain rounded-lg"
                  alt="Post"
                />
              ))}
            </div>
          )}
          <div className="border-t border-gray-200 pt-3">
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Bình luận
            </div>
            {post.comments?.map((c, i) => (
              <div key={i} className="text-sm border-b border-gray-200 py-2">
                <span className="text-green-700 font-medium">
                  {c.userName}:
                </span>{" "}
                <span className="text-gray-700">{c.content}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
