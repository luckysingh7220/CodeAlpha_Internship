const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Post = require('../models/Post');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/social_media_app';

const users = [
  {
    username: 'alex_dev',
    email: 'alex@example.com',
    password: 'password123',
    bio: '🚀 Full-stack developer | Building the future one commit at a time',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Dev&background=6c5ce7&color=fff&size=200',
  },
  {
    username: 'sarah_designs',
    email: 'sarah@example.com',
    password: 'password123',
    bio: '🎨 UI/UX Designer | Pixel perfectionist | Coffee enthusiast',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+D&background=fd79a8&color=fff&size=200',
  },
  {
    username: 'mike_photos',
    email: 'mike@example.com',
    password: 'password123',
    bio: '📸 Photographer | Capturing moments that matter | Nature lover',
    avatar: 'https://ui-avatars.com/api/?name=Mike+P&background=00cec9&color=fff&size=200',
  },
  {
    username: 'priya_codes',
    email: 'priya@example.com',
    password: 'password123',
    bio: '💻 Software Engineer @ Big Tech | Open source contributor | Tea > Coffee',
    avatar: 'https://ui-avatars.com/api/?name=Priya+C&background=f9ca24&color=333&size=200',
  },
  {
    username: 'jordan_music',
    email: 'jordan@example.com',
    password: 'password123',
    bio: '🎵 Music producer | Guitarist | Creating vibes since 2015',
    avatar: 'https://ui-avatars.com/api/?name=Jordan+M&background=e17055&color=fff&size=200',
  },
];

const posts = [
  {
    content: 'Just deployed my first full-stack app to production! 🎉 The feeling when everything works on the first try is unmatched. #webdev #coding #milestone',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600',
    authorIndex: 0,
  },
  {
    content: 'New design concept for a social media dashboard. Going with a dark glassmorphism theme — what do you think? 🖤✨',
    image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600',
    authorIndex: 1,
  },
  {
    content: 'Golden hour at the mountains today. Sometimes you just need to disconnect and let nature reset your mind. 🌄',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    authorIndex: 2,
  },
  {
    content: 'Just open-sourced my React component library! 500+ stars in the first week 🌟 Thanks to everyone who contributed. Link in bio!',
    image: '',
    authorIndex: 3,
  },
  {
    content: 'New track dropping this Friday! Here\'s a sneak peek from the studio session 🎸🔥 #newmusic #studio #producer',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600',
    authorIndex: 4,
  },
  {
    content: 'Pro tip: Always write tests BEFORE refactoring. Learned this the hard way today when I broke 3 features trying to "clean up" the codebase. 😅 #devlife',
    image: '',
    authorIndex: 0,
  },
  {
    content: 'Color palette exploration for a fintech app. Went with cool blues and warm accents for trust + energy. 💙🧡 What\'s your favorite combo?',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600',
    authorIndex: 1,
  },
  {
    content: 'Street photography in Tokyo is a whole different experience. Every corner tells a story. 🏙️🇯🇵',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',
    authorIndex: 2,
  },
  {
    content: 'Excited to announce I\'m joining the core team of an open-source database project! 🎉 Can\'t wait to dive deep into distributed systems.',
    image: '',
    authorIndex: 3,
  },
  {
    content: 'Late night jam session produced something magical. When the creative flow hits, you just have to ride the wave 🌊🎶',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600',
    authorIndex: 4,
  },
  {
    content: 'The difference between a good developer and a great developer? Communication. Code is just the medium — understanding people is the real skill. 💡',
    image: '',
    authorIndex: 0,
  },
  {
    content: 'Minimalism in UI design doesn\'t mean boring. It means every pixel has a purpose. Here\'s my take on a todo app that sparks joy ✨',
    image: 'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=600',
    authorIndex: 1,
  },
];

const comments = [
  { text: 'Congrats! That first deploy feeling never gets old 🎊', authorIndex: 1, postIndex: 0 },
  { text: 'Love the glassmorphism trend! Super clean 👏', authorIndex: 0, postIndex: 1 },
  { text: 'This is absolutely stunning! Where is this?', authorIndex: 3, postIndex: 2 },
  { text: 'Amazing work! Just starred the repo ⭐', authorIndex: 2, postIndex: 3 },
  { text: 'Can\'t wait to hear the full track! 🔥', authorIndex: 1, postIndex: 4 },
  { text: 'Been there, done that 😂 Tests save lives!', authorIndex: 3, postIndex: 5 },
  { text: 'That blue-orange combo is 🔥🔥🔥', authorIndex: 4, postIndex: 6 },
  { text: 'Tokyo street vibes are unreal. Great shot!', authorIndex: 0, postIndex: 7 },
  { text: 'Huge congrats! You deserve it 🎉', authorIndex: 4, postIndex: 8 },
  { text: 'The vibes in this photo though! 🎵', authorIndex: 2, postIndex: 9 },
  { text: 'So true! Soft skills are underrated in tech', authorIndex: 1, postIndex: 10 },
  { text: 'I need this todo app in my life!', authorIndex: 3, postIndex: 11 },
  { text: 'What stack did you use?', authorIndex: 4, postIndex: 0 },
  { text: 'Totally agree — less is more when done right ✨', authorIndex: 0, postIndex: 11 },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`👥 Created ${createdUsers.length} users`);

    // Set up follow relationships
    // alex follows sarah, mike, priya
    createdUsers[0].following.push(createdUsers[1]._id, createdUsers[2]._id, createdUsers[3]._id);
    createdUsers[1].followers.push(createdUsers[0]._id);
    createdUsers[2].followers.push(createdUsers[0]._id);
    createdUsers[3].followers.push(createdUsers[0]._id);

    // sarah follows alex, jordan
    createdUsers[1].following.push(createdUsers[0]._id, createdUsers[4]._id);
    createdUsers[0].followers.push(createdUsers[1]._id);
    createdUsers[4].followers.push(createdUsers[1]._id);

    // mike follows alex, sarah, priya
    createdUsers[2].following.push(createdUsers[0]._id, createdUsers[1]._id, createdUsers[3]._id);
    createdUsers[0].followers.push(createdUsers[2]._id);
    createdUsers[1].followers.push(createdUsers[2]._id);
    createdUsers[3].followers.push(createdUsers[2]._id);

    // priya follows everyone
    createdUsers[3].following.push(
      createdUsers[0]._id,
      createdUsers[1]._id,
      createdUsers[2]._id,
      createdUsers[4]._id
    );
    createdUsers[0].followers.push(createdUsers[3]._id);
    createdUsers[1].followers.push(createdUsers[3]._id);
    createdUsers[2].followers.push(createdUsers[3]._id);
    createdUsers[4].followers.push(createdUsers[3]._id);

    // jordan follows alex, mike
    createdUsers[4].following.push(createdUsers[0]._id, createdUsers[2]._id);
    createdUsers[0].followers.push(createdUsers[4]._id);
    createdUsers[2].followers.push(createdUsers[4]._id);

    for (const user of createdUsers) {
      await user.save({ validateBeforeSave: false });
    }
    console.log('🔗 Set up follow relationships');

    // Create posts
    const createdPosts = [];
    for (const postData of posts) {
      const post = await Post.create({
        author: createdUsers[postData.authorIndex]._id,
        content: postData.content,
        image: postData.image,
      });
      createdPosts.push(post);
    }
    console.log(`📝 Created ${createdPosts.length} posts`);

    // Add comments
    for (const commentData of comments) {
      const post = createdPosts[commentData.postIndex];
      post.comments.push({
        user: createdUsers[commentData.authorIndex]._id,
        text: commentData.text,
      });
    }

    // Add likes (randomized)
    for (let i = 0; i < createdPosts.length; i++) {
      const numLikes = Math.floor(Math.random() * 4) + 1;
      const shuffledUsers = [...createdUsers].sort(() => Math.random() - 0.5);
      for (let j = 0; j < numLikes; j++) {
        createdPosts[i].likes.push(shuffledUsers[j]._id);
      }
    }

    for (const post of createdPosts) {
      await post.save();
    }
    console.log('💬 Added comments and likes');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('   Email: alex@example.com    | Password: password123');
    console.log('   Email: sarah@example.com   | Password: password123');
    console.log('   Email: mike@example.com    | Password: password123');
    console.log('   Email: priya@example.com   | Password: password123');
    console.log('   Email: jordan@example.com  | Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDB();
