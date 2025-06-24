import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";

export default function PostPage({ token, username }) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [copiedPostId, setCopiedPostId] = useState(null);
  const [showAllComments, setShowAllComments] = useState({});

  const userId = localStorage.getItem("userId");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const uploadImages = async () => {
    const uploaded = [];
    for (const file of images) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(
        `${config.apiUrl}/api/Upload/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      uploaded.push(res.data.imageUrl);
    }
    return uploaded;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return alert("Vui lòng nhập nội dung!");
    const imageUrls = await uploadImages();

    await axios.post(
      `${config.apiUrl}/api/Posts`,
      { content, imageUrls, userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setContent("");
    setImages([]);
    setPreview([]);
    loadPosts();
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(
        `${config.apiUrl}/api/Posts/${postId}/like?userId=${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadPosts();
    } catch (err) {
      alert("Bạn đã thích bài viết này rồi.");
    }
  };

  const handleComment = async (postId) => {
    const content = commentText[postId];
    if (!content?.trim()) return;
    await axios.post(
      `${config.apiUrl}/api/Posts/${postId}/comment`,
      { content, userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    loadPosts();
  };

  const handleShare = async (postId) => {
    const url = `${window.location.origin}/posts/${postId}`;
    await navigator.clipboard.writeText(url);
    setCopiedPostId(postId);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  const loadPosts = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}/api/Posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        setPosts(res.data);
      } else {
        console.error("Expected array but got:", res.data);
        setPosts([]);
      }
    } catch (err) {
      console.error("Failed to load posts:", err);
      setPosts([]);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Create Post Form */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-green-600">📝</span> Tạo bài viết
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 placeholder-gray-400"
              placeholder="Bạn đang nghĩ gì?"
            />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition">
                <span className="text-green-600">📷</span>
                <span className="text-sm text-gray-600">Ảnh</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            {preview.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {preview.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    alt="Preview"
                  />
                ))}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:bg-gray-400"
              disabled={!content.trim() && !images.length}
            >
              Đăng bài
            </button>
          </form>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {Array.isArray(posts) &&
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold">
                      {post.userName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {post.userName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleString("vi-VN")}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-gray-800 whitespace-pre-line">
                    {post.content}
                  </div>
                  {post.imageUrls?.length > 0 && (
                    <div className="mt-3 flex justify-center">
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
                </div>
                <div className="px-4 py-2 border-t border-gray-200 flex justify-between text-sm text-gray-600">
                  <span>❤️ {post.likeCount || 0} lượt thích</span>
                  <span>{post.comments?.length || 0} bình luận</span>
                </div>
                <div className="border-t border-gray-200 flex divide-x divide-gray-200">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex-1 py-2 text-gray-600 hover:bg-gray-100 transition flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <span className="text-green-600">❤️</span> Thích
                  </button>
                  <button
                    onClick={() => handleShare(post.id)}
                    className="flex-1 py-2 text-gray-600 hover:bg-gray-100 transition flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <span className="text-blue-600">🔗</span> Chia sẻ
                  </button>
                </div>
                {copiedPostId === post.id && (
                  <div className="px-4 py-1 text-xs text-gray-500 bg-gray-50">
                    Đã sao chép liên kết!
                  </div>
                )}
                <div className="p-4 border-t border-gray-200">
                  {(showAllComments[post.id]
                    ? post.comments
                    : post.comments?.slice(0, 3)
                  )?.map((c, i) => (
                    <div key={i} className="mb-2 text-sm">
                      <span className="font-medium text-gray-800">
                        {c.userName}:
                      </span>{" "}
                      <span className="text-gray-700">{c.content}</span>
                    </div>
                  ))}
                  {post.comments?.length > 3 && (
                    <button
                      className="text-blue-600 text-sm hover:underline"
                      onClick={() =>
                        setShowAllComments((prev) => ({
                          ...prev,
                          [post.id]: !prev[post.id],
                        }))
                      }
                    >
                      {showAllComments[post.id]
                        ? "Ẩn bớt bình luận"
                        : "Xem thêm bình luận"}
                    </button>
                  )}
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={commentText[post.id] || ""}
                      onChange={(e) =>
                        setCommentText((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      placeholder="Viết bình luận..."
                      className="flex-1 border border-gray-300 px-3 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={() => handleComment(post.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition"
                    >
                      Gửi
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
