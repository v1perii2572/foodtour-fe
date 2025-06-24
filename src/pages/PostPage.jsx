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

    console.log("Gửi bài viết với userId:", userId);

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
    <div className="max-w-2xl mx-auto py-6 space-y-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow space-y-4"
      >
        <h2 className="text-lg font-semibold">📝 Tạo bài viết</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full p-2 border rounded"
          placeholder="Bạn đang nghĩ gì?"
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
        <div className="flex gap-2 flex-wrap">
          {preview.map((src, i) => (
            <img
              key={i}
              src={src}
              className="w-24 h-24 object-cover rounded border"
            />
          ))}
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Đăng bài
        </button>
      </form>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-green-800">🧾 Bài viết</h3>
        {Array.isArray(posts) &&
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded p-4 shadow space-y-3"
            >
              <div className="font-semibold text-green-700">
                {post.userName}
              </div>
              <div className="text-gray-700 whitespace-pre-line">
                {post.content}
              </div>
              <div className="flex gap-2 flex-wrap">
                {post.imageUrls?.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    className="w-28 h-28 object-cover rounded border"
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleString("vi-VN")}
              </div>
              <div className="flex gap-4 items-center text-sm">
                <button
                  onClick={() => handleLike(post.id)}
                  className="text-green-600 hover:underline"
                >
                  ❤️ Thích ({post.likeCount})
                </button>
                <button
                  onClick={() => handleShare(post.id)}
                  className="text-blue-600 hover:underline"
                >
                  🔗 Chia sẻ
                </button>
                {copiedPostId === post.id && (
                  <span className="text-gray-500 text-xs">
                    Đã sao chép liên kết!
                  </span>
                )}
              </div>
              <div className="mt-2 space-y-2">
                <div className="text-sm text-gray-700 font-semibold">
                  Bình luận
                </div>
                {post.comments?.map((c, i) => (
                  <div key={i} className="text-sm border-t pt-1">
                    <span className="text-green-700 font-medium">
                      {c.userEmail}:
                    </span>{" "}
                    {c.content}
                  </div>
                ))}
                <div className="flex mt-2 gap-2">
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
                    className="flex-1 border px-3 py-1 rounded text-sm"
                  />
                  <button
                    onClick={() => handleComment(post.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Gửi
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
