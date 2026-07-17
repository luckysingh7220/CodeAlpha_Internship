import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const UserCard = ({ userData }) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(
    userData.followers?.some((f) => (f._id || f) === user?._id) || false
  );
  const [loading, setLoading] = useState(false);

  const isOwnProfile = user?._id === userData._id;

  const handleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading || isOwnProfile) return;

    setLoading(true);
    try {
      const { data } = await userAPI.followUser(userData._id);
      setIsFollowing(data.isFollowing);
    } catch (err) {
      console.error('Follow error:', err);
    }
    setLoading(false);
  };

  return (
    <div className="user-card">
      <Link to={`/profile/${userData._id}`}>
        <img src={userData.avatar} alt={userData.username} className="avatar avatar-md" />
      </Link>
      <div className="user-card-info">
        <Link to={`/profile/${userData._id}`} className="user-card-name">
          {userData.username}
        </Link>
        <p className="user-card-bio">{userData.bio || 'No bio yet'}</p>
      </div>
      {!isOwnProfile && user && (
        <button
          className={`btn btn-sm user-card-follow-btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
          onClick={handleFollow}
          disabled={loading}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  );
};

export default UserCard;
