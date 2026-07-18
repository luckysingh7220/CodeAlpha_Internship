import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, postAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import PostCard from '../components/PostCard';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const { addToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowList, setShowFollowList] = useState(null); // 'followers' | 'following' | null
  const [followList, setFollowList] = useState([]);
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isOwnProfile = currentUser?._id === id;

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [userRes, postsRes] = await Promise.all([
        userAPI.getUser(id),
        postAPI.getUserPosts(id),
      ]);
      setProfile(userRes.data);
      setPosts(postsRes.data.posts);
      setTotalPages(postsRes.data.pages);
      setIsFollowing(
        userRes.data.followers?.some((f) => (f._id || f) === currentUser?._id)
      );
      setEditBio(userRes.data.bio || '');
      setEditAvatar(userRes.data.avatar || '');
    } catch (err) {
      console.error('Profile error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
    setPage(1);
  }, [id]);

  const handleFollow = async () => {
    try {
      const { data } = await userAPI.followUser(id);
      setIsFollowing(data.isFollowing);
      setProfile((prev) => ({
        ...prev,
        followerCount: data.followerCount,
        followers: data.isFollowing
          ? [...(prev.followers || []), { _id: currentUser._id }]
          : (prev.followers || []).filter((f) => (f._id || f) !== currentUser._id),
      }));
      addToast(data.isFollowing ? 'Followed user' : 'Unfollowed user', 'success');
    } catch (err) {
      console.error('Follow error:', err);
      addToast('Failed to follow user', 'error');
    }
  };

  const handleSaveProfile = async () => {
    setEditSaving(true);
    try {
      const { data } = await userAPI.updateProfile({ bio: editBio, avatar: editAvatar });
      setProfile((prev) => ({ ...prev, bio: data.bio, avatar: data.avatar }));
      updateUser({ bio: data.bio, avatar: data.avatar });
      setShowEditModal(false);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error('Update error:', err);
      addToast('Failed to update profile', 'error');
    }
    setEditSaving(false);
  };

  const handleShowFollowList = async (type) => {
    try {
      const { data } =
        type === 'followers'
          ? await userAPI.getFollowers(id)
          : await userAPI.getFollowing(id);
      setFollowList(data);
      setShowFollowList(type);
    } catch (err) {
      console.error('Follow list error:', err);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  const handleLoadMore = async () => {
    if (page < totalPages) {
      try {
        const { data } = await postAPI.getUserPosts(id, page + 1);
        setPosts((prev) => [...prev, ...data.posts]);
        setPage(page + 1);
      } catch (err) {
        console.error('Load more error:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">😢</div>
        <h3 className="empty-state-title">User not found</h3>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header animate-fadeInUp">
        <div className="profile-header-content">
          <div className="profile-avatar-section">
            <img src={profile.avatar} alt={profile.username} className="avatar avatar-xl" />
          </div>
          <div className="profile-info-section">
            <h1 className="profile-name">{profile.username}</h1>
            <p className="profile-username">@{profile.username}</p>
            {profile.bio && <p className="profile-bio">{profile.bio}</p>}

            <div className="profile-stats">
              <div className="profile-stat">
                <div className="profile-stat-value">{posts.length}</div>
                <div className="profile-stat-label">Posts</div>
              </div>
              <div
                className="profile-stat"
                onClick={() => handleShowFollowList('followers')}
              >
                <div className="profile-stat-value">
                  {profile.followerCount ?? profile.followers?.length ?? 0}
                </div>
                <div className="profile-stat-label">Followers</div>
              </div>
              <div
                className="profile-stat"
                onClick={() => handleShowFollowList('following')}
              >
                <div className="profile-stat-value">
                  {profile.followingCount ?? profile.following?.length ?? 0}
                </div>
                <div className="profile-stat-label">Following</div>
              </div>
            </div>

            <div className="profile-actions">
              {isOwnProfile ? (
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(true)}
                >
                  ✏️ Edit Profile
                </button>
              ) : (
                <button
                  className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={handleFollow}
                >
                  {isFollowing ? '✓ Following' : '+ Follow'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <h2 className="profile-posts-title">
        {isOwnProfile ? 'Your Posts' : `Posts by ${profile.username}`}
      </h2>

      {posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3 className="empty-state-title">No posts yet</h3>
          <p className="empty-state-text">
            {isOwnProfile
              ? "You haven't posted anything yet. Share your first thought!"
              : `${profile.username} hasn't posted yet.`}
          </p>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPostUpdate={handlePostUpdate}
              onPostDelete={handlePostDelete}
            />
          ))}
          {page < totalPages && (
            <button className="btn btn-secondary load-more-btn" onClick={handleLoadMore}>
              Load More
            </button>
          )}
        </>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowEditModal(false)}>
          <div className="modal-content">
            <div className="profile-edit-form">
              <h2 className="profile-edit-title">Edit Profile</h2>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-bio">Bio</label>
                <textarea
                  id="edit-bio"
                  className="form-input form-textarea"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell the world about yourself..."
                  maxLength={200}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {editBio.length}/200
                </span>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-avatar">Profile Picture URL</label>
                <input
                  id="edit-avatar"
                  type="text"
                  className="form-input"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div className="profile-edit-actions">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveProfile}
                  disabled={editSaving}
                >
                  {editSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Followers/Following Modal */}
      {showFollowList && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowFollowList(null)}>
          <div className="modal-content">
            <div className="follow-list-header">
              <h3 className="follow-list-title">
                {showFollowList === 'followers' ? 'Followers' : 'Following'}
              </h3>
              <button className="follow-list-close" onClick={() => setShowFollowList(null)}>
                ✕
              </button>
            </div>
            <div className="follow-list-body">
              {followList.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-state-text">
                    {showFollowList === 'followers' ? 'No followers yet' : 'Not following anyone'}
                  </p>
                </div>
              ) : (
                followList.map((u) => (
                  <Link
                    key={u._id}
                    to={`/profile/${u._id}`}
                    className="follow-list-item"
                    onClick={() => setShowFollowList(null)}
                  >
                    <img src={u.avatar} alt={u.username} className="avatar avatar-sm" />
                    <div className="follow-list-item-info">
                      <div className="follow-list-item-name">{u.username}</div>
                      {u.bio && <div className="follow-list-item-bio">{u.bio.slice(0, 60)}</div>}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
