import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import StatsCard from './components/StatsCard';
import EnrollmentTable from './components/EnrollmentTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiUsers, FiBookOpen } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not admin
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        setStats(response.data.data);
      } catch (err) {
        setError('Failed to fetch dashboard statistics');
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of your platform statistics
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FiUsers size={24} />}
        />
        <StatsCard
          title="Total Enrollments"
          value={stats.totalEnrollments}
          icon={<FiBookOpen size={24} />}
        />
      </div>

      {/* Recent Enrollments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Enrollments</h2>
        <EnrollmentTable enrollments={stats.recentEnrollments} />
      </div>
    </div>
  );
};

export default Dashboard;