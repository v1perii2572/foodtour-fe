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
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="text-green-700 font-bold text-lg">{post.userName}</div>
      <div className="whitespace-pre-line text-gray-800">{post.content}</div>
      <div className="flex gap-2 flex-wrap">
        {post.imageUrls?.map((url, i) => (
          <img
            key={i}
            src={url}
            className="w-32 h-32 object-cover rounded border"
          />
        ))}
      </div>
      <div className="text-sm text-gray-500">
        {new Date(post.createdAt).toLocaleString("vi-VN")}
      </div>
      <div className="mt-2">
        <div className="text-sm font-semibold text-gray-700 mb-1">
          Bình luận
        </div>
        {post.comments?.map((c, i) => (
          <div key={i} className="text-sm border-t pt-1">
            <span className="text-green-700 font-medium">{c.userName}:</span>{" "}
            {c.content}
          </div>
        ))}
      </div>
    </div>
  );
}
