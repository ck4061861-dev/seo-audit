import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const META = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'audit', icon: '🔍', label: 'Audit' },
  { key: 'reports', icon: '📄', label: 'Reports' },
  { key: 'users', icon: '👥', label: 'Users' },
  { key: 'insights', icon: '🧠', label: 'AI Insights' },
  { key: 'content', icon: '📅', label: 'Content' },
  { key: 'competitors', icon: '🏆', label: 'Competitors' },
  { key: 'analytics', icon: '📈', label: 'Analytics' },
  { key: 'settings', icon: '⚙️', label: 'Settings' },
];

function formatNumber(value) {
  return value?.toLocaleString?.() ?? '0';
}

const simpleFetch = async (url, defaultValue = null) => {
  try {
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) throw new Error('Fetch failed');
    return await res.json();
  } catch (error) {
    console.warn(url, error);
    return defaultValue;
  }
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState('dashboard');

  const [dashboard, setDashboard] = useState({
    totalAudits: 0,
    activeUsers: 0,
    topSites: [],
    avgSeo: 0,
    recent: [],
  });

  const [audits, setAudits] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  const [filters, setFilters] = useState({ search: '', status: 'all', page: 1, limit: 10, from: '', to: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      simpleFetch('/api/admin/dashboard', {
        totalAudits: 0,
        activeUsers: 0,
        topSites: [],
        avgSeo: 0,
        recent: [],
      }),
      simpleFetch('/api/admin/audits', []),
      simpleFetch('/api/admin/users', []),
      simpleFetch('/api/admin/reports', []),
    ])
      .then(([dd, aa, uu, rr]) => {
        setDashboard(dd);
        setAudits(aa);
        setUsers(uu);
        setReports(rr);
      })
      .finally(() => setLoading(false));
  }, []);

  const auditView = useMemo(() => {
    const q = filters.search.toLowerCase();
    return audits
      .filter((item) => (filters.status === 'all' ? true : item.status === filters.status))
      .filter((item) => item.site.toLowerCase().includes(q) || item.id.toLowerCase().includes(q))
      .slice((filters.page - 1) * filters.limit, filters.page * filters.limit);
  }, [audits, filters]);

  const userView = useMemo(() => {
    const q = filters.search.toLowerCase();
    return users
      .filter((item) => (filters.status === 'all' ? true : item.status === filters.status))
      .filter((item) => item.name.toLowerCase().includes(q) || item.email.toLowerCase().includes(q))
      .slice((filters.page - 1) * filters.limit, filters.page * filters.limit);
  }, [users, filters]);

  const reportView = useMemo(() => {
    const q = filters.search.toLowerCase();
    return reports
      .filter((item) => !filters.from || item.generated >= filters.from)
      .filter((item) => !filters.to || item.generated <= filters.to)
      .filter((item) => item.domain.toLowerCase().includes(q))
      .slice((filters.page - 1) * filters.limit, filters.page * filters.limit);
  }, [reports, filters]);

  const [adminMessage, setAdminMessage] = useState("");

  const applyFilterChange = (key, val) => setFilters((prev) => ({ ...prev, [key]: val, page: 1 }));

  const toggleBlock = async (id) => {
    const targetUser = users.find((u) => u.id === id);
    if (!targetUser) return;

    const newBlocked = !targetUser.blocked;

    try {
      const res = await fetch(`/api/admin/users/${id}/block`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ blocked: newBlocked }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Update failed');
      }

      const updated = await res.json();

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, blocked: updated.blocked, status: updated.status }
            : u
        )
      );

      // Reflect in local storage if currently signed-in user is affected
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const localUser = JSON.parse(stored);
          if (localUser?.id === id) {
            localStorage.setItem(
              'user',
              JSON.stringify({ ...localUser, blocked: updated.blocked, status: updated.status })
            );
          }
        }
      } catch (err) {
        console.warn('Failed to update local user blocked status', err);
      }

      setAdminMessage(
        `${targetUser.name || targetUser.email || 'User'} has been ${updated.blocked ? 'blocked' : 'unblocked'}.`
      );
    } catch (err) {
      setAdminMessage(`Unable to update block state: ${err.message}`);
    }
  };

  const renderSection = () => {
    if (active === 'dashboard') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard label="Total audits run" value={dashboard.totalAudits} />
            <StatCard label="Active users" value={dashboard.activeUsers} />
            <StatCard label="Avg SEO score" value={`${dashboard.avgSeo}%`} />
            <StatCard label="Top sites" value={dashboard.topSites.length} />
            <StatCard label="Recent activity" value={dashboard.recent.length} />
          </div>
          <Panel title="Top Performing Sites">{dashboard.topSites.map((site) => <li key={site.site}>{site.site} — {site.score}%</li>)}</Panel>
          <Panel title="Recent Activity">{dashboard.recent.map((item) => <li key={`${item.site}-${item.when}`}>{item.site} • {item.action} • {item.when}</li>)}</Panel>
        </div>
      );
    }

    if (active === 'audit') {
      return (
        <div className="space-y-5">
          <SubHeader title="Audit Management" />
          <FilterRow filters={filters} onChange={applyFilterChange} statuses={[ 'all', 'completed', 'pending' ]} />
          <Table headers={[ 'Audit ID', 'Website', 'Status', 'Score', 'Date', 'Actions' ]} rows={auditView.map((item) => ([item.id, item.site, item.status, item.score || '-', item.date, '']) )} />
        </div>
      );
    }

    if (active === 'reports') {
      return (
        <div className="space-y-5">
          <SubHeader title="Reports Section" />
          <div className="flex flex-wrap gap-2 items-end">
            <input type="date" value={filters.from} onChange={(e) => applyFilterChange('from', e.target.value)} className="border px-2 py-1 rounded" placeholder="From" />
            <input type="date" value={filters.to} onChange={(e) => applyFilterChange('to', e.target.value)} className="border px-2 py-1 rounded" placeholder="To" />
            <input type="text" value={filters.search} onChange={(e) => applyFilterChange('search', e.target.value)} className="border px-2 py-1 rounded flex-1" placeholder="Filter by domain" />
            <button className="bg-blue-600 text-white rounded px-3 py-1">Export again</button>
          </div>
          <Table headers={[ 'Report ID', 'Domain', 'Generated', 'File', 'Actions' ]} rows={reportView.map((rep) => ([rep.id, rep.domain, rep.generated, rep.file, 'Download']))} />
        </div>
      );
    }

    if (active === 'users') {
      return (
        <div className="space-y-5">
          <SubHeader title="Users Management" />
          <FilterRow filters={filters} onChange={applyFilterChange} statuses={[ 'all', 'active', 'inactive', 'blocked' ]} />

          {adminMessage && (
            <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-sm text-indigo-800">
              {adminMessage}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr>
                  {['User ID', 'Name', 'Email', 'Phone', 'Status', 'Last Login', 'Actions'].map((h) => (
                    <th key={h} className="px-3 py-2 border-b border-gray-200 text-sm text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {userView.length === 0 ? (
                  <tr>
                    <td className="p-3" colSpan={7}>No users found</td>
                  </tr>
                ) : (
                  userView.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm border-b border-gray-100">{u.id}</td>
                      <td className="px-3 py-2 text-sm border-b border-gray-100">{u.name}</td>
                      <td className="px-3 py-2 text-sm border-b border-gray-100">{u.email}</td>
                      <td className="px-3 py-2 text-sm border-b border-gray-100">{u.phone || 'N/A'}</td>
                      <td className="px-3 py-2 text-sm border-b border-gray-100">
                        {u.blocked ? 'Blocked' : u.status || 'Active'}
                      </td>
                      <td className="px-3 py-2 text-sm border-b border-gray-100">{u.lastLogin || '-'}</td>
                      <td className="px-3 py-2 text-sm border-b border-gray-100">
                        <button
                          onClick={() => toggleBlock(u.id)}
                          className={`px-3 py-1 rounded font-semibold text-white ${u.blocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                          {u.blocked ? 'Unblock' : 'Block'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (active === 'insights') {
      return (
        <div className="space-y-5">
          <SubHeader title="AI Insights" />
          <Panel title="Common SEO Issues">TODO: integrate AI recommendations.</Panel>
          <Panel title="Trending Problems">TODO: integrate AI trends.</Panel>
        </div>
      );
    }

    if (active === 'content') {
      return (
        <div className="space-y-5">
          <SubHeader title="Content Planner" />
          <Panel title="6-Month Content Calendar">Calendar and tasks go here.</Panel>
        </div>
      );
    }

    if (active === 'competitors') {
      return (
        <div className="space-y-5">
          <SubHeader title="Competitor Analysis" />
          <Panel title="Competitor list">TODO</Panel>
        </div>
      );
    }

    if (active === 'analytics') {
      return (
        <div className="space-y-5">
          <SubHeader title="Analytics" />
          <Panel title="Growth chart">TODO</Panel>
        </div>
      );
    }

    if (active === 'settings') {
      return (
        <div className="space-y-5">
          <SubHeader title="Settings" />
          <Panel title="Admin profile">TODO</Panel>
        </div>
      );
    }

    return <p>Unknown section</p>;
  };

  return (
    <div className="min-h-screen bg-gray-100 text-slate-800">
      <div className="max-w-[1520px] mx-auto grid grid-cols-12 gap-4 p-4">
        <aside className="col-span-12 lg:col-span-3 xl:col-span-2 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Admin</h2>
          <ul className="space-y-1">
            {META.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => setActive(item.key)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${active === item.key ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="col-span-12 lg:col-span-9 xl:col-span-10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold uppercase tracking-wider">{META.find((item) => item.key === active)?.label}</h1>
            <div className="flex gap-2">
              <input
                className="border px-2 py-1 rounded"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => applyFilterChange('search', e.target.value)}
              />
              <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => window.location.reload()}>Refresh</button>
              <button className="bg-slate-600 text-white px-3 py-1 rounded" onClick={() => navigate('/')}>Back Home</button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            {loading ? <div>Loading...</div> : renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

function StatCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <div className="text-xs uppercase tracking-widest text-gray-500">{label}</div>
      <div className="text-2xl font-bold mt-1">{formatNumber(value)}</div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold mb-2">{title}</h3>
      <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">{children}</ul>
    </div>
  );
}

function SubHeader({ title }) {
  return <h3 className="text-xl font-semibold mb-3">{title}</h3>;
}

function FilterRow({ filters, onChange, statuses }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <select value={filters.status} onChange={(e) => onChange('status', e.target.value)} className="border px-2 py-1 rounded">
        {statuses.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
      <label className="text-sm text-gray-500">Page</label>
      <input type="number" value={filters.page} min={1} onChange={(e) => onChange('page', Number(e.target.value))} className="border px-2 py-1 rounded w-16" />
      <label className="text-sm text-gray-500">Limit</label>
      <input type="number" value={filters.limit} min={1} onChange={(e) => onChange('limit', Number(e.target.value))} className="border px-2 py-1 rounded w-16" />
      <button className="bg-blue-600 text-white px-3 py-1 rounded">Export</button>
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr>
            {headers.map((head) => <th key={head} className="px-3 py-2 border-b border-gray-200 text-sm text-gray-500">{head}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td className="p-3" colSpan={headers.length}>No records found</td></tr>
          ) : rows.map((row, idx) => (
            <tr key={`${row[0]}-${idx}`} className="hover:bg-gray-50">
              {row.map((cell, cellIdx) => <td key={`${idx}-${cellIdx}`} className="px-3 py-2 text-sm border-b border-gray-100">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
