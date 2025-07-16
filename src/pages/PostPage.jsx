import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { fakePosts } from "./fakePosts"; // Assuming fakePosts is imported from the provided file

export default function PostPage({ token, username, userId }) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [copiedPostId, setCopiedPostId] = useState(null);
  const [showAllComments, setShowAllComments] = useState({});
  const [search, setSearch] = useState("");
  const [filterDays, setFilterDays] = useState("all");

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
    document.getElementById("imageInput").value = null;
    loadPosts();
  };

  const handleLike = async (postId) => {
    await axios.post(
      `${config.apiUrl}/api/Posts/${postId}/like?userId=${userId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadPosts();
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
      const res = await axios.get(
        `${config.apiUrl}/api/Posts?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const apiPosts = Array.isArray(res.data) ? res.data : [];
      // Combine fakePosts with API posts
      setPosts([...fakePosts, ...apiPosts]);
    } catch {
      // If API fails, use only fakePosts
      setPosts(fakePosts);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchSearch =
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      post.userName.toLowerCase().includes(search.toLowerCase());

    let matchDate = true;
    if (filterDays !== "all") {
      const postDate = new Date(post.createdAt);
      const now = new Date();
      const daysAgo = new Date();
      daysAgo.setDate(now.getDate() - parseInt(filterDays));
      matchDate = postDate >= daysAgo;
    }

    return matchSearch && matchDate;
  });

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
                  id="imageInput"
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

        <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm bài viết hoặc người đăng..."
            className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={filterDays}
            onChange={(e) => setFilterDays(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Tất cả ngày</option>
            <option value="1">Hôm nay</option>
            <option value="7">7 ngày gần đây</option>
            <option value="30">30 ngày gần đây</option>
          </select>
        </div>

        <div className="space-y-6">
          {filteredPosts.map((post) => (
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
                  className={`flex-1 py-2 hover:bg-gray-100 transition flex items-center justify-center gap-2 text-sm font-medium ${
                    post.isLiked ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  <span>{post.isLiked ? "❤️" : "🤍"}</span> Thích
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
                    쇼핑몰="Viết bình luận..."
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
const fakePosts = [
  {
    id: 1,
    userName: "Nguyễn Văn An",
    content: "Hôm nay mình thử món phở bò tại Phở Thìn, rất ngon và đậm đà!",
    imageUrls: ["https://images.unsplash.com/photo-1512058564366-4c4e4e1c6143"],
    likeCount: 12,
    comments: [
      {
        userName: "Trần Thị Mai",
        content: "Mình cũng thích phở bò tại Phở Thìn!",
      },
      { userName: "Lê Văn Hùng", content: "Phở ở đây đúng là tuyệt vời!" },
    ],
    isLiked: false,
    createdAt: "2025-07-16T10:00:00Z",
  },
  {
    id: 2,
    userName: "Phạm Thị Ngọc",
    content:
      "Mới thử món sushi ở Sushi Kei. Món ăn tươi ngon nhưng giá hơi cao.",
    imageUrls: ["https://images.unsplash.com/photo-1579584425555-35d27bf4a8d3"],
    likeCount: 45,
    comments: [
      {
        userName: "Vũ Quang Minh",
        content: "Sushi ở Sushi Kei có ngon không bạn?",
      },
      {
        userName: "Nguyễn Thị Hương",
        content: "Mình cũng thích sushi ở đó, nhưng đúng là giá hơi cao.",
      },
    ],
    isLiked: true,
    createdAt: "2025-07-15T08:30:00Z",
  },
  {
    id: 3,
    userName: "Đỗ Minh Tuấn",
    content:
      "Hôm nay mình thử món bánh xèo tại Bánh Xèo 46A, không được như mong đợi, hơi khô và nhạt.",
    imageUrls: ["https://images.unsplash.com/photo-1629644295879-4b6e5e2489a7"],
    likeCount: 8,
    comments: [
      {
        userName: "Lê Thị Hồng",
        content:
          "Bánh xèo ở đó không ngon hả bạn? Mình nghe mọi người khen nhiều mà.",
      },
    ],
    isLiked: false,
    createdAt: "2025-07-14T09:00:00Z",
  },
  {
    id: 4,
    userName: "Trần Văn Hoàng",
    content: "Ngày mai mình sẽ bắt đầu thử thách mới. Cảm thấy hào hứng!",
    imageUrls: [],
    likeCount: 38,
    comments: [
      { userName: "Nguyễn Thị Linh", content: "Chúc bạn thành công nhé!" },
      {
        userName: "Lê Văn Nam",
        content: "Mình cũng muốn tham gia thử thách này!",
      },
    ],
    isLiked: true,
    createdAt: "2025-07-13T11:00:00Z",
  },
  {
    id: 5,
    userName: "Hoàng Minh Đức",
    content: "Mình đang học một khóa học mới tại FUNiX, rất thú vị!",
    imageUrls: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3"],
    likeCount: 56,
    comments: [
      { userName: "Trương Thị Hà", content: "Chúc mừng bạn, học tốt nhé!" },
      {
        userName: "Phạm Văn Long",
        content: "Khóa học nào vậy? Mình cũng muốn đăng ký!",
      },
    ],
    isLiked: false,
    createdAt: "2025-07-12T12:30:00Z",
  },
  {
    id: 6,
    userName: "Lê Quang Vinh",
    content: "Cuối tuần này mình sẽ đi du lịch Đà Lạt! Đang rất háo hức.",
    imageUrls: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e"],
    likeCount: 67,
    comments: [
      {
        userName: "Nguyễn Thị Thảo",
        content: "Wow, chúc bạn có chuyến đi vui vẻ!",
      },
      {
        userName: "Trần Thị Yến",
        content: "Đà Lạt đẹp lắm, mình cũng muốn đi!",
      },
    ],
    isLiked: true,
    createdAt: "2025-07-11T14:00:00Z",
  },
  {
    id: 7,
    userName: "Vũ Quang Huy",
    content:
      "Mình vừa hoàn thành một dự án lớn tại FPT, rất tự hào với bản thân!",
    imageUrls: ["https://images.unsplash.com/photo-1516321497487-e288fb19713f"],
    likeCount: 81,
    comments: [
      {
        userName: "Nguyễn Thị Quỳnh",
        content: "Chúc mừng bạn! Thành công tiếp theo nhé!",
      },
      {
        userName: "Trương Thị Hương",
        content:
          "Bản thân mình cũng cảm thấy rất vui khi hoàn thành một dự án!",
      },
    ],
    isLiked: false,
    createdAt: "2025-07-10T15:30:00Z",
  },
  {
    id: 8,
    userName: "Nguyễn Thị Thu",
    content:
      "Sắp tới tôi sẽ tổ chức một buổi hòa nhạc tại Nhà Văn Hóa Thanh Niên. Rất mong nhận được sự ủng hộ!",
    imageUrls: ["https://images.unsplash.com/photo-1514525253161-7a46d19cd819"],
    likeCount: 29,
    comments: [
      {
        userName: "Lê Minh Nhật",
        content: "Tuyệt vời, tôi rất muốn tham gia!",
      },
    ],
    isLiked: true,
    createdAt: "2025-07-09T16:00:00Z",
  },
  {
    id: 9,
    userName: "Trần Thị Lan",
    content: "Bắt đầu đọc cuốn 'Đắc Nhân Tâm', thật sự rất thú vị!",
    imageUrls: [],
    likeCount: 21,
    comments: [
      {
        userName: "Lê Thị Minh",
        content: "Cuốn sách này mình cũng đang đọc!",
      },
      { userName: "Nguyễn Thanh Tùng", content: "Mình cũng yêu sách!" },
    ],
    isLiked: false,
    createdAt: "2025-07-08T17:30:00Z",
  },
  {
    id: 10,
    userName: "Phạm Thị Hồng",
    content: "Đã thử món bún riêu tại Bún Riêu Cua 6A, rất ngon!",
    imageUrls: ["https://images.unsplash.com/photo-1598516802417-8d17f2d3b648"],
    likeCount: 63,
    comments: [
      {
        userName: "Trần Minh Khang",
        content: "Món này trông rất hấp dẫn! Quán ở đâu vậy?",
      },
    ],
    isLiked: true,
    createdAt: "2025-07-07T18:30:00Z",
  },
  {
    id: 11,
    userName: "Nguyễn Quang Anh",
    content:
      "Sắp tới mình sẽ đi phỏng vấn tại VinAI. Hy vọng mọi thứ sẽ suôn sẻ!",
    imageUrls: [],
    likeCount: 34,
    comments: [
      { userName: "Lê Thị Hoa", content: "Chúc bạn may mắn!" },
      {
        userName: "Nguyễn Thanh Bình",
        content: "Hy vọng bạn sẽ có công việc như ý!",
      },
    ],
    isLiked: false,
    createdAt: "2025-07-06T19:00:00Z",
  },
  {
    id: 12,
    userName: "Bùi Thị Ngọc",
    content: "Mình vừa tham gia một sự kiện tại GEM Center! Thật tuyệt vời.",
    imageUrls: ["https://images.unsplash.com/photo-1517457373958-b4bdd8b50e05"],
    likeCount: 27,
    comments: [
      { userName: "Nguyễn Minh Thư", content: "Sự kiện gì vậy?" },
      {
        userName: "Trương Bích Phượng",
        content: "Mong muốn được tham gia lần sau!",
      },
    ],
    isLiked: true,
    createdAt: "2025-07-05T20:30:00Z",
  },
  {
    id: 13,
    userName: "Phạm Minh Đức",
    content: "Một ngày đẹp trời để đi dạo tại Công viên 30/4!",
    imageUrls: ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000"],
    likeCount: 16,
    comments: [
      { userName: "Trần Quỳnh Anh", content: "Cảm giác tuyệt vời!" },
      { userName: "Lê Thanh Phong", content: "Ngày hôm nay thật tuyệt vời!" },
    ],
    isLiked: false,
    createdAt: "2025-07-04T21:00:00Z",
  },
  {
    id: 14,
    userName: "Đoàn Thị Hương",
    content: "Mình đang thử một thói quen mới, hy vọng sẽ thành công.",
    imageUrls: [],
    likeCount: 50,
    comments: [
      {
        userName: "Nguyễn Minh Khang",
        content: "Mình cũng thử thói quen này!",
      },
    ],
    isLiked: true,
    createdAt: "2025-07-03T22:00:00Z",
  },
  {
    id: 15,
    userName: "Lê Thị Thảo",
    content: "Mình vừa kết thúc một buổi học online tại Kyna, rất bổ ích!",
    imageUrls: ["https://images.unsplash.com/photo-1527689368864-3a2c27e71999"],
    likeCount: 12,
    comments: [
      { userName: "Phạm Minh Khôi", content: "Mình cũng đang học khóa này!" },
    ],
    isLiked: false,
    createdAt: "2025-07-02T23:00:00Z",
  },
  {
    id: 16,
    userName: "Nguyễn Bảo Trân",
    content: "Cảm ơn tất cả các bạn đã luôn ủng hộ mình!",
    imageUrls: [],
    likeCount: 72,
    comments: [
      { userName: "Lê Thanh Mai", content: "Mình sẽ luôn ủng hộ bạn!" },
      { userName: "Nguyễn Bích Hạnh", content: "Chúc bạn luôn thành công!" },
    ],
    isLiked: true,
    createdAt: "2025-07-01T10:15:00Z",
  },
  {
    id: 17,
    userName: "Lâm Thanh Tùng",
    content:
      "Cuối tuần này sẽ là dịp để gặp gỡ bạn bè tại Quán cà phê Nhà Sàn.",
    imageUrls: ["https://images.unsplash.com/photo-1495470946180-0b3c805bf430"],
    likeCount: 85,
    comments: [
      {
        userName: "Lê Quang Duy",
        content: "Hy vọng bạn có một buổi gặp mặt tuyệt vời!",
      },
      {
        userName: "Trần Minh Tuấn",
        content: "Mình cũng sẽ gặp bạn bè tại đó vào cuối tuần này!",
      },
    ],
    isLiked: false,
    createdAt: "2025-06-30T11:20:00Z",
  },
  {
    id: 18,
    userName: "Phạm Minh Châu",
    content: "Đọc cuốn 'Nhà Giả Kim', cảm thấy rất hữu ích!",
    imageUrls: [],
    likeCount: 43,
    comments: [
      {
        userName: "Nguyễn Quang Vinh",
        content: "Cuốn sách này mình cũng đang đọc!",
      },
    ],
    isLiked: true,
    createdAt: "2025-06-29T12:50:00Z",
  },
  {
    id: 19,
    userName: "Nguyễn Thành Đạt",
    content: "Cùng nhau làm việc và học hỏi, đó là chìa khóa thành công.",
    imageUrls: ["https://images.unsplash.com/photo-1516321497487-e288fb19713f"],
    likeCount: 32,
    comments: [
      { userName: "Nguyễn Thiện Hùng", content: "Mình hoàn toàn đồng ý!" },
    ],
    isLiked: false,
    createdAt: "2025-06-28T13:40:00Z",
  },
  {
    id: 20,
    userName: "Lê Minh Thư",
    content: "Mình đang chuẩn bị cho kỳ thi IELTS, mong mọi chuyện suôn sẻ!",
    imageUrls: [],
    likeCount: 64,
    comments: [
      { userName: "Phan Thị Lan", content: "Chúc bạn thi tốt nhé!" },
      { userName: "Lê Minh Tú", content: "Hy vọng bạn sẽ đạt điểm cao!" },
    ],
    isLiked: true,
    createdAt: "2025-06-27T14:00:00Z",
  },
  {
    id: 21,
    userName: "Hoàng Thị Mai",
    content:
      "Mới thử món cơm tấm tại Cơm Tấm Ba Ghiền, rất ngon và hợp khẩu vị!",
    imageUrls: ["https://images.unsplash.com/photo-1598516802417-8d17f2d3b648"],
    likeCount: 55,
    comments: [
      { userName: "Vũ Thị Quỳnh", content: "Món này có giá hợp lý không?" },
      {
        userName: "Nguyễn Thanh Hoa",
        content: "Mình rất thích cơm tấm tại đó!",
      },
    ],
    isLiked: true,
    createdAt: "2025-06-26T15:00:00Z",
  },
  {
    id: 22,
    userName: "Nguyễn Lan Anh",
    content: "Bánh mì kẹp thịt tại Bánh Mì Bà Dư ngon xuất sắc! Đáng thử!",
    imageUrls: ["https://images.unsplash.com/photo-1555988639-34c765b717e0"],
    likeCount: 40,
    comments: [
      { userName: "Lê Phương Anh", content: "Bánh mì ở đó thật tuyệt vời!" },
    ],
    isLiked: false,
    createdAt: "2025-06-24T13:20:00Z",
  },
  {
    id: 23,
    userName: "Trần Thị Ngọc",
    content:
      "Thử món bún bò Huế ở Bún Bò Huế Cô Hà, hương vị rất đặc trưng, sẽ quay lại!",
    imageUrls: ["https://images.unsplash.com/photo-1598516802417-8d17f2d3b648"],
    likeCount: 36,
    comments: [
      {
        userName: "Lâm Minh Quang",
        content: "Cảm nhận của bạn về nước dùng thế nào?",
      },
      { userName: "Nguyễn Thị Hương", content: "Món này ăn cực kỳ ngon luôn!" },
    ],
    isLiked: true,
    createdAt: "2025-06-24T13:20:00Z",
  },
  {
    id: 24,
    userName: "Mai Thị Hồng",
    content:
      "Món hủ tiếu tại Hủ Tiếu Nam Vang Nhân Quán là một sự kết hợp hoàn hảo!",
    imageUrls: ["https://images.unsplash.com/photo-1598516802417-8d17f2d3b648"],
    likeCount: 61,
    comments: [
      { userName: "Nguyễn Thanh Bình", content: "Quán này ở đâu vậy bạn?" },
    ],
    isLiked: false,
    createdAt: "2025-06-23T12:00:00Z",
  },
  {
    id: 25,
    userName: "Lê Thị Hoa",
    content: "Món chè tại Chè Kỳ Đồng thật sự rất ngon, mùi vị thơm béo!",
    imageUrls: ["https://images.unsplash.com/photo-1629644295879-4b6e5e2489a7"],
    likeCount: 50,
    comments: [
      { userName: "Nguyễn Minh Thư", content: "Chè này có gì đặc biệt vậy?" },
    ],
    isLiked: true,
    createdAt: "2025-06-22T11:00:00Z",
  },
];
