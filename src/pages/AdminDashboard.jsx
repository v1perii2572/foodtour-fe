import { useEffect, useState } from "react";
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

export default function AdminDashboard() {
  const [tab, setTab] = useState("users");
  const [userSummary, setUserSummary] = useState(null);
  const [activitySummary, setActivitySummary] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [postSummary, setPostSummary] = useState(null);
  const [routeSummary, setRouteSummary] = useState(null);
  const [feedbackSummary, setFeedbackSummary] = useState(null);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const apiUrl = config.apiUrl;

  const fetchJson = async (url, setter) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setter(data);
    } catch (err) {
      console.error("API Error:", url, err.message);
    }
  };

  useEffect(() => {
    fetchJson(`${apiUrl}/api/admin/stats/users/summary`, setUserSummary);
    fetchJson(
      `${apiUrl}/api/admin/stats/users/activity-summary?from=${fromDate}&to=${toDate}`,
      setActivitySummary
    );
    fetchJson(
      `${apiUrl}/api/admin/stats/users/activity-log?from=${fromDate}&to=${toDate}`,
      setActivityLog
    );
    fetchJson(`${apiUrl}/api/admin/stats/posts/summary`, setPostSummary);
    fetchJson(`${apiUrl}/api/admin/stats/routes/summary`, setRouteSummary);
    fetchJson(
      `${apiUrl}/api/admin/stats/feedbacks/summary`,
      setFeedbackSummary
    );
    fetchJson(`${apiUrl}/api/admin/stats/payments/summary`, setPaymentSummary);
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
          <YAxis />
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
          { id: "feedbacks", label: "Feedback" },
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

      {tab === "users" && userSummary && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card title="Tổng số user" value={userSummary.total} />
            <Card title="User trả phí" value={userSummary.paid} />
            <Card title="User mới tháng này" value={userSummary.newThisMonth} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Biểu đồ tương tác tổng hợp
            </h3>
            {renderCombinedChart()}
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

      {tab === "feedbacks" && feedbackSummary && (
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
      )}

      {tab === "payments" && paymentSummary && (
        <div className="space-y-6">
          <Card title="Tổng giao dịch" value={paymentSummary.total} />
          <Card title="Thành công" value={paymentSummary.totalSuccess} />
          <Card title="Thất bại" value={paymentSummary.totalFailed} />
          <Card title="Doanh thu (vnđ)" value={paymentSummary.revenue} />
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
