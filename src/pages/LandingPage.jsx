import { useEffect, useState } from 'react';
import API from '../api/axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';


const LandingPage = () => {
  const [tutors, setTutors] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchTutors();
    fetchAnalytics();
    fetchReviews();
  }, []);

  const fetchTutors = async () => {
    const { data } = await API.get('/users/tutors');

    const enriched = await Promise.all(
      data.map(async (t) => {
        try {
          const res = await API.get(`/reviews/rating/${t._id}`);
          return { ...t, ...res.data };
        } catch {
          return { ...t, avgRating: 0, total: 0 };
        }
      })
    );

    enriched.sort((a, b) => b.avgRating - a.avgRating);
    setTutors(enriched.slice(0, 3));
  };

  const fetchAnalytics = async () => {
    const { data } = await API.get('/admin/analytics');
    setAnalytics(data);
  };

  const fetchReviews = async () => {
    const { data } = await API.get('/reviews');
    setReviews(data.slice(0, 3));
  };

  return (
    <div className="font-sans">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-4 shadow">
        <h1 className="text-xl font-bold">DenkMathematical</h1>

        <div className="space-x-4">
          <Link to="/login" className="text-gray-600">Login</Link>
          <Link to="/register" className="bg-black text-white px-4 py-2 rounded">
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <motion.section initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white" >
        <h1 className="text-5xl font-bold">
          Learn Faster with Expert Tutors
        </h1>

        <p className="mt-4 text-lg">
          Book tutors, join live classes, and access premium study materials.
        </p>

        <div className="mt-6">
          <Link to="/register">
            <button className="bg-white text-black px-6 py-3 rounded-lg mr-4">
              Get Started
            </button>
          </Link>

          <Link to="/login">
            <button className="border px-6 py-3 rounded-lg">
              Login
            </button>
          </Link>
        </div>
      </motion.section>

      {/* FEATURES */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold">Why Choose Us</h2>

        <div className="grid md:grid-cols-3 gap-8 mt-10 px-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 shadow rounded-xl cursor-pointer transition"
          >
            <h3 className="text-xl font-semibold">📚 Materials</h3>
            <p>Access curated study resources</p>
          </motion.div>

          <div className="p-6 shadow rounded-xl">
            <h3 className="text-xl font-semibold">👨‍🏫 Tutors</h3>
            <p>Verified expert tutors</p>
          </div>

          <div className="p-6 shadow rounded-xl">
            <h3 className="text-xl font-semibold">🎥 Live Sessions</h3>
            <p>Interactive real-time classes</p>
          </div>
        </div>
      </section>

      {/* TOP TUTORS */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold">Top Tutors</h2>

        <div className="flex justify-center gap-6 mt-10">
          {tutors.map((t, i) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white p-6 rounded-xl shadow w-60 hover:shadow-lg transition"
            >
              <h4 className="font-semibold">{t.name}</h4>
              <p className="mt-2">⭐ {t.avgRating?.toFixed(1)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ANALYTICS */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold">Our Impact</h2>

        <div className="flex justify-center gap-10 mt-10 text-xl">
          <div>
            <p className="font-bold">{analytics.users || 0}</p>
            <p>Users</p>
          </div>

          <div>
            <p className="font-bold">{analytics.tutors || 0}</p>
            <p>Tutors</p>
          </div>

          <div>
            <p className="font-bold">{analytics.requests || 0}</p>
            <p>Sessions</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold">Testimonials</h2>

        <div className="flex justify-center gap-6 mt-10">
          {reviews.map((r) => (
            <div key={r._id} className="bg-white p-6 rounded-xl shadow w-64">
              <p>⭐ {r.rating}</p>
              <p className="italic">"{r.comment}"</p>
              <p className="text-sm mt-2">- {r.student?.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white text-center py-6">
        <p>© 2026 DenkMathematical</p>
      </footer>
    </div>
  );
};

export default LandingPage;