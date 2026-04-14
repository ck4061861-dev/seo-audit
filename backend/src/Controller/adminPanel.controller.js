import User from '../Models/userAuth.Model.js';
import Audit from '../Models/audit.model.js';

export async function getDashboard(req, res) {
  try {
    const totalAudits = await Audit.countDocuments();
    const activeUsers = await User.countDocuments();
    const topSitesAgg = await Audit.aggregate([
      { $group: { _id: '$domain', avgScore: { $avg: '$overallScore' }, count: { $sum: 1 } } },
      { $sort: { avgScore: -1, count: -1 } },
      { $limit: 5 },
      { $project: { site: '$_id', score: { $round: ['$avgScore', 1] }, _id: 0 } },
    ]);

    const avgSeo = Math.round(await Audit.aggregate([{ $group: { _id: null, avg: { $avg: '$overallScore' } } }])?.[0]?.avg || 0);

    const recent = await Audit.find().sort({ createdAt: -1 }).limit(8).select('domain status overallScore createdAt').lean();

    res.json({
      totalAudits,
      activeUsers,
      topSites: topSitesAgg,
      avgSeo,
      recent: recent.map((item) => ({ site: item.domain, action: item.status, score: item.overallScore, when: item.createdAt })),
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Unable to fetch dashboard stats' });
  }
}

export async function getAudits(req, res) {
  try {
    const audits = await Audit.find().sort({ createdAt: -1 }).lean();
    res.json(audits.map((item) => ({
      id: item._id,
      site: item.domain,
      status: item.status,
      score: item.overallScore,
      date: item.createdAt.toISOString().split('T')[0],
      report: item.reportUrl,
    })));
  } catch (err) {
    console.error('Audits error:', err);
    res.status(500).json({ error: 'Unable to fetch audits' });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    res.json(users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone || 'N/A',
      status: u.blocked ? 'blocked' : u.active === false ? 'inactive' : 'active',
      blocked: Boolean(u.blocked),
      lastLogin: u.updatedAt ? u.updatedAt.toISOString().split('T')[0] : '',
    })));
  } catch (err) {
    console.error('Users error:', err);
    res.status(500).json({ error: 'Unable to fetch users' });
  }
}

export async function updateUserBlockedState(req, res) {
  try {
    const { id } = req.params;
    const { blocked } = req.body;

    if (typeof blocked !== 'boolean') {
      return res.status(400).json({ error: 'blocked must be boolean' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { blocked },
      { new: true }
    ).lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.blocked ? 'blocked' : user.active === false ? 'inactive' : 'active',
      blocked: user.blocked,
      lastLogin: user.updatedAt ? user.updatedAt.toISOString().split('T')[0] : '',
    });

  } catch (err) {
    console.error('Update user blocked error:', err);
    res.status(500).json({ error: 'Unable to update user blocked state' });
  }
}

export async function getReports(req, res) {
  try {
    // for now, audit docs are report source
    const reports = await Audit.find().sort({ createdAt: -1 }).lean();
    res.json(reports.map((item) => ({
      id: item._id,
      domain: item.domain,
      generated: item.createdAt.toISOString().split('T')[0],
      file: item.reportUrl || `report-${item._id}.pdf`,
      score: item.overallScore,
    })));
  } catch (err) {
    console.error('Reports error:', err);
    res.status(500).json({ error: 'Unable to fetch reports' });
  }
}
