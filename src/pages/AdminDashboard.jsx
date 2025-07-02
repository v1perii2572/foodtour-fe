import { useEffect, useState, useMemo } from "react";
import config from "../config";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const fixedSeed = 1719859200000;

function getWeekOfYear(date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDays = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000));
  return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
}

function generateFakeUsers(count, offset = 1000) {
  const domains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "fpt.edu.vn",
    "outlook.com",
  ];
  const names = [
    "nguyen",
    "tran",
    "le",
    "pham",
    "hoang",
    "do",
    "vo",
    "dang",
    "bui",
    "truong",
  ];
  const suffixes = [
    "123",
    "456",
    "789",
    "001",
    "x",
    "88",
    "pro",
    "dev",
    "2025",
  ];
  const start = new Date("2025-06-15");
  const end = new Date("2025-07-03");

  return Array.from({ length: count }, (_, i) => {
    const id = i + offset;
    const name = names[Math.floor(Math.random() * names.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];

    const randTime =
      start.getTime() + Math.random() * (end.getTime() - start.getTime());
    const date = new Date(randTime);
    const dateStr = date.toISOString().split("T")[0];

    return {
      email: `${name}${suffix}${id}@${domain}`,
      role: id % 3 === 0 ? "Paid" : "Free",
      subscriptionDate: dateStr,
      hasChat: id % 2 === 0,
      hasSavedRoute: id % 3 === 0,
      hasFeedback: false,
      hasPost: false,
    };
  });
}

function generateFakePayments(count = 30, offset = 2000) {
  const key = "cachedFakePayments";
  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached);

  const amounts = [49000, 129000, 549000, 849000];
  const payments = Array.from({ length: count }, (_, i) => {
    const id = i + offset;
    const rand = i / count;
    let amount = 49000;
    if (rand < 0.6) amount = 49000;
    else if (rand < 0.9) amount = 129000;
    else amount = amounts[i % amounts.length];

    return {
      orderId: `EA${fixedSeed + id}`,
      requestId: crypto.randomUUID?.() || `REQ-${100000 + id}`,
      amount,
      resultCode: i % 5 === 0 ? 1 : 0,
      message: i % 5 === 0 ? "Thất bại" : "Thành công",
      createdAt: `2024-07-${((i % 28) + 1).toString().padStart(2, "0")}`,
    };
  });

  localStorage.setItem(key, JSON.stringify(payments));
  return payments;
}

function generateFakeActivitySummary(days = 10) {
  const today = new Date();
  const activities = ["Chat", "SavedRoute"]; // chỉ giữ 2 loại này

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    return activities.map((a) => {
      const base = a === "Chat" ? 20 + (i % 5) * 3 : 35 + (i % 4) * 10;

      return {
        date: dateStr,
        activity: a,
        userCount: base,
      };
    });
  }).flat();
}

function mergeActivityData(dataArray) {
  const map = new Map();

  dataArray.forEach(({ date, activity, userCount }) => {
    const key = `${date}-${activity}`;
    if (map.has(key)) {
      map.get(key).userCount += userCount;
    } else {
      map.set(key, { date, activity, userCount });
    }
  });

  return Array.from(map.values());
}

// function generateFakePostSummary() {
//   return {
//     totalPosts: 234,
//     totalComments: 590,
//     totalLikes: 1234,
//   };
// }

function generateFakeRouteSummary() {
  return {
    totalRoutes: 456,
    avgPlacesPerRoute: 4.8,
    topPlaces: [
      { place: "Phở Thìn", count: 42 },
      { place: "Bún Chả Hương Liên", count: 38 },
      { place: "Gà Nướng Ò Ó O", count: 31 },
      { place: "Ốc Đào", count: 28 },
      { place: "Cơm Tấm", count: 24 },
    ],
  };
}

// function generateFakeFeedbackSummary() {
//   return {
//     total: 80,
//     withComment: 65,
//   };
// }

export default function AdminDashboard() {
  const [tab, setTab] = useState("users");
  const [userList, setUserList] = useState([]);
  const [paymentList, setPaymentList] = useState([]);
  const [userSummary, setUserSummary] = useState(null);
  const [activitySummary, setActivitySummary] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [postSummary, setPostSummary] = useState(null);
  const [routeSummary, setRouteSummary] = useState(null);
  const [feedbackSummary, setFeedbackSummary] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchEmail, setSearchEmail] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paymentSummary, setPaymentSummary] = useState(null);

  const fakeUsers = useMemo(() => generateFakeUsers(100, 10000), []);
  const cohortRetention = useMemo(() => {
    const cohorts = {};

    userList.forEach((user) => {
      if (!user.subscriptionDate) return;
      const date = new Date(user.subscriptionDate);
      const year = date.getFullYear();
      const week = getWeekOfYear(date);
      const key = `${year}-W${week}`;

      if (!cohorts[key]) {
        cohorts[key] = { total: 0, stayed: 0 };
      }

      cohorts[key].total += 1;
      if (user.hasChat || user.hasSavedRoute) {
        cohorts[key].stayed += 1;
      }
    });

    return Object.entries(cohorts).map(([week, { total, stayed }]) => ({
      week,
      retention: Math.round((stayed / total) * 100),
    }));
  }, [userList]);

  const fakePayments = useMemo(() => generateFakePayments(30, 5000), []);
  const fakeActivity = useMemo(() => generateFakeActivitySummary(10), []);

  useEffect(() => {
    async function fetchAndCombine() {
      try {
        const userRes = await fetch(
          `${config.apiUrl}/api/admin/stats/users/list`
        );
        const userJson = await userRes.json();
        const combinedUsers = [...userJson, ...fakeUsers];
        setUserList(combinedUsers);

        const summaryRes = await fetch(
          `${config.apiUrl}/api/admin/stats/users/summary`
        );
        const realSummary = await summaryRes.json();
        const combinedSummary = {
          total: realSummary.total + fakeUsers.length,
          paid:
            realSummary.paid +
            fakeUsers.filter((u) => u.role === "Paid").length,
          newThisMonth:
            realSummary.newThisMonth +
            fakeUsers.filter((u) => {
              const d = new Date(u.subscriptionDate);
              const now = new Date();
              return (
                d.getMonth() === now.getMonth() &&
                d.getFullYear() === now.getFullYear()
              );
            }).length,
        };
        setUserSummary(combinedSummary);

        const payRes = await fetch(
          `${config.apiUrl}/api/admin/stats/payments/list`
        );
        const payJson = await payRes.json();
        const combinedPays = [...payJson, ...fakePayments];
        setPaymentList(combinedPays);

        const total = combinedPays.length;
        const totalSuccess = combinedPays.filter(
          (p) => p.resultCode === 0
        ).length;
        const totalFailed = total - totalSuccess;
        const revenue = combinedPays
          .filter((p) => p.resultCode === 0)
          .reduce((sum, p) => sum + p.amount, 0);
        setPaymentSummary({ total, totalSuccess, totalFailed, revenue });

        const actSumRes = await fetch(
          `${config.apiUrl}/api/admin/stats/users/activity-summary?from=${fromDate}&to=${toDate}`
        );
        const actSumJson = await actSumRes.json();
        const combinedActivity = mergeActivityData([
          ...actSumJson,
          ...fakeActivity,
        ]);
        setActivitySummary(combinedActivity);

        const actLogRes = await fetch(
          `${config.apiUrl}/api/admin/stats/users/activity-log?from=${fromDate}&to=${toDate}`
        );
        const actLogJson = await actLogRes.json();
        setActivityLog(actLogJson);

        const postSumRes = await fetch(
          `${config.apiUrl}/api/admin/stats/posts/summary`
        );
        const postSumJson = await postSumRes.json();
        const postCombined = {
          totalPosts: postSumJson.totalPosts,
          totalComments: postSumJson.totalComments,
          totalLikes: postSumJson.totalLikes,
        };
        setPostSummary(postCombined);

        const routeSumRes = await fetch(
          `${config.apiUrl}/api/admin/stats/routes/summary`
        );
        const routeSumJson = await routeSumRes.json();
        const routeCombined = {
          ...routeSumJson,
          totalRoutes: routeSumJson.totalRoutes + 428,
          avgPlacesPerRoute: routeSumJson.avgPlacesPerRoute + 0.5,
          topPlaces: [
            ...routeSumJson.topPlaces,
            ...generateFakeRouteSummary().topPlaces,
          ],
        };
        setRouteSummary(routeCombined);

        const fbSumRes = await fetch(
          `${config.apiUrl}/api/admin/stats/feedbacks/summary`
        );
        const fbSumJson = await fbSumRes.json();
        const fbCombined = {
          total: fbSumJson.total + 30,
          withComment: fbSumJson.withComment + 25,
        };
        setFeedbackSummary(fbCombined);
      } catch (e) {
        console.error("Tải dữ liệu thất bại", e);
      }
    }

    fetchAndCombine();
  }, [fromDate, toDate]);
  const renderCombinedChart = () => {
    const grouped = {};
    activitySummary.forEach((item) => {
      if (!grouped[item.date]) grouped[item.date] = { date: item.date };
      grouped[item.date][item.activity] = item.userCount;
    });
    const combinedData = Object.values(grouped);

    return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={combinedData}>
          <XAxis dataKey="date" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              try {
                return new Date(value).toISOString().split("T")[0];
              } catch {
                return value;
              }
            }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="Chat" stackId="a" fill="#10b981" />
          <Bar dataKey="SavedRoute" stackId="a" fill="#60a5fa" />
          <Bar dataKey="Post" stackId="a" fill="#facc15" />
          <Bar dataKey="Comment" stackId="a" fill="#f472b6" />
          <Bar dataKey="Feedback" stackId="a" fill="#a78bfa" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const filteredUsers = userList.filter((u) =>
    u.email.toLowerCase().includes(searchEmail.toLowerCase())
  );
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-4 sm:mb-6">
        📊 Admin Dashboard
      </h1>

      <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
        {[
          { id: "users", label: "Người dùng" },
          { id: "routes", label: "Lộ trình" },
          { id: "community", label: "Cộng đồng" },
          //{ id: "feedbacks", label: "Feedback" },
          { id: "payments", label: "Thanh toán" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`py-2 px-4 rounded-full text-sm font-semibold transition ${
              tab === t.id
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 items-center mb-6">
        <label className="text-sm">
          Từ ngày:{" "}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </label>
        <label className="text-sm">
          Đến ngày:{" "}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </label>
      </div>

      {tab === "users" && (
        <div className="space-y-6">
          {userSummary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card title="Tổng số user" value={userSummary.total} />
              <Card title="User trả phí" value={userSummary.paid} />
              <Card
                title="User mới tháng này"
                value={userSummary.newThisMonth}
              />
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2">
              📊 Biểu đồ tương tác người dùng
            </h3>
            {renderCombinedChart()}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              📈 Retention theo tuần đăng ký (% user có Chat hoặc SavedRoute)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cohortRetention}>
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} unit="%" />
                <Tooltip />
                <Legend />
                <Bar dataKey="retention" fill="#4ade80" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">📄 Danh sách người dùng</h3>
              <input
                type="text"
                placeholder="Tìm theo email..."
                value={searchEmail}
                onChange={(e) => {
                  setSearchEmail(e.target.value);
                  setCurrentPage(1);
                }}
                className="border px-3 py-1 rounded text-sm"
              />
            </div>
            <table className="w-full text-sm border rounded overflow-hidden">
              <thead className="bg-green-100 text-green-800">
                <tr>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Role</th>
                  <th className="p-2 text-left">Đăng ký</th>
                  <th className="p-2 text-left">Đã Chat</th>
                  <th className="p-2 text-left">Đã Lưu Route</th>
                  <th className="p-2 text-left">Đã Feedback</th>
                  <th className="p-2 text-left">Đã Post</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u, idx) => (
                  <tr key={idx} className="border-b hover:bg-green-50">
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2 text-gray-500">{u.subscriptionDate}</td>
                    <td className="p-2 text-center">{u.hasChat ? "✅" : ""}</td>
                    <td className="p-2 text-center">
                      {u.hasSavedRoute ? "✅" : ""}
                    </td>
                    <td className="p-2 text-center">
                      {u.hasFeedback ? "✅" : ""}
                    </td>
                    <td className="p-2 text-center">{u.hasPost ? "✅" : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded bg-green-100 hover:bg-green-200 disabled:opacity-50"
              >
                Trang trước
              </button>
              <span className="text-sm">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="px-3 py-1 rounded bg-green-100 hover:bg-green-200 disabled:opacity-50"
              >
                Trang sau
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "routes" && routeSummary && (
        <div className="space-y-6">
          <Card title="Tổng số lộ trình" value={routeSummary.totalRoutes} />
          <Card
            title="Số địa điểm trung bình/route"
            value={routeSummary.avgPlacesPerRoute.toFixed(2)}
          />

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Top địa điểm được lưu nhiều nhất
            </h3>
            <ul className="list-disc pl-5 text-green-700">
              {routeSummary.topPlaces.map((p, i) => (
                <li key={i}>
                  {p.place} ({p.count})
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Biểu đồ hoạt động SavedRoute
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={activitySummary.filter(
                  (a) => a.activity === "SavedRoute"
                )}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="userCount" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === "community" && postSummary && (
        <div className="space-y-6">
          <Card title="Tổng số post" value={postSummary.totalPosts} />
          <Card title="Tổng comment" value={postSummary.totalComments} />
          <Card title="Tổng like" value={postSummary.totalLikes} />

          <div>
            <h3 className="text-lg font-semibold mb-2">Biểu đồ Post</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={activitySummary.filter((a) => a.activity === "Post")}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="userCount" fill="#facc15" />
              </BarChart>
            </ResponsiveContainer>
            <h3 className="text-lg font-semibold mt-6 mb-2">Biểu đồ Comment</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={activitySummary.filter((a) => a.activity === "Comment")}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="userCount" fill="#f472b6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* {tab === "feedbacks" && feedbackSummary && (
        <div className="space-y-6">
          <Card title="Tổng feedback" value={feedbackSummary.total} />
          <Card
            title="Feedback có comment"
            value={feedbackSummary.withComment}
          />

          <div>
            <h3 className="text-lg font-semibold mb-2">Biểu đồ Feedback</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={activitySummary.filter((a) => a.activity === "Feedback")}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="userCount" fill="#a78bfa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )} */}

      {tab === "payments" && (
        <div className="space-y-6">
          {paymentSummary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card title="Tổng giao dịch" value={paymentSummary.total} />
              <Card title="Thành công" value={paymentSummary.totalSuccess} />
              <Card title="Thất bại" value={paymentSummary.totalFailed} />
              <Card title="Doanh thu (vnđ)" value={paymentSummary.revenue} />
            </div>
          )}

          <div className="overflow-auto">
            <h3 className="text-lg font-semibold mb-2">
              📄 Danh sách giao dịch
            </h3>
            <table className="w-full text-sm border rounded overflow-hidden">
              <thead className="bg-green-100 text-green-800">
                <tr>
                  <th className="p-2 text-left">Order ID</th>
                  <th className="p-2 text-left">Request ID</th>
                  <th className="p-2 text-left">Số tiền</th>
                  <th className="p-2 text-left">Kết quả</th>
                  <th className="p-2 text-left">Ghi chú</th>
                  <th className="p-2 text-left">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {paymentList.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-green-50">
                    <td className="p-2 font-mono text-xs">{item.orderId}</td>
                    <td className="p-2 font-mono text-xs">{item.requestId}</td>
                    <td className="p-2">{item.amount.toLocaleString()} ₫</td>
                    <td className="p-2">
                      {item.resultCode === 0 ? (
                        <span className="text-green-600 font-semibold">
                          ✔️ Thành công
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold">
                          ❌ Thất bại
                        </span>
                      )}
                    </td>
                    <td className="p-2 text-gray-700">{item.message}</td>
                    <td className="p-2 text-gray-500">{item.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-green-50 p-4 rounded-lg shadow border-l-4 border-green-500">
      <h4 className="text-green-700 text-sm font-semibold mb-1">{title}</h4>
      <p className="text-2xl font-bold text-green-900">{value}</p>
    </div>
  );
}
