const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

// Load env vars
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding...');

    // Clean up old fake users and their data before seeding
    const oldEmails = [
      'alice@example.com', 'bob@example.com', 'charlie@example.com', 
      'diana@example.com', 'evan@example.com', 'fiona@example.com', 'george@example.com',
      'arjun@example.com', 'priya@example.com', 'rahul@example.com',
      'neha@example.com', 'karan@example.com', 'sneha@example.com', 'vikram@example.com'
    ];
    
    // Find old users to delete their posts, etc
    const usersToDelete = await User.find({ email: { $in: oldEmails } });
    const userIdsToDelete = usersToDelete.map(u => u._id);
    
    if (userIdsToDelete.length > 0) {
      await Post.deleteMany({ author: { $in: userIdsToDelete } });
      await Comment.deleteMany({ author: { $in: userIdsToDelete } });
      await Notification.deleteMany({ $or: [{ sender: { $in: userIdsToDelete } }, { recipient: { $in: userIdsToDelete } }] });
      await User.deleteMany({ _id: { $in: userIdsToDelete } });
      console.log('🧹 Cleaned up old seed data');
    }

    // Let's create an array of fake user data
    const fakeUsers = [
      { name: 'Arjun Sharma', email: 'arjun@example.com', password: 'Password@123', bio: 'Full-stack developer from Bangalore.', avatar: 'https://i.pravatar.cc/150?u=arjun' },
      { name: 'Priya Patel', email: 'priya@example.com', password: 'Password@123', bio: 'Tech blogger and enthusiastic coder.', avatar: 'https://i.pravatar.cc/150?u=priya' },
      { name: 'Rahul Desai', email: 'rahul@example.com', password: 'Password@123', bio: 'UI/UX Designer who loves React.', avatar: 'https://i.pravatar.cc/150?u=rahul' },
      { name: 'Neha Gupta', email: 'neha@example.com', password: 'Password@123', bio: 'Data scientist playing with AI.', avatar: 'https://i.pravatar.cc/150?u=neha' },
      { name: 'Karan Singh', email: 'karan@example.com', password: 'Password@123', bio: 'DevOps and cloud architecture.', avatar: 'https://i.pravatar.cc/150?u=karan' },
      { name: 'Sneha Reddy', email: 'sneha@example.com', password: 'Password@123', bio: 'CSS wizard and frontend master.', avatar: 'https://i.pravatar.cc/150?u=sneha' },
      { name: 'Vikram Joshi', email: 'vikram@example.com', password: 'Password@123', bio: 'Backend architecture is my jam.', avatar: 'https://i.pravatar.cc/150?u=vikram' },
    ];

    const createdUsers = [];

    for (const u of fakeUsers) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        user = await User.create({ ...u, role: 'user' });
        console.log(`Created user: ${user.name}`);
      }
      createdUsers.push(user);
    }

    // Now let's make them follow each other
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      // Every user follows the user next to them and the previous user, to create a web of followers
      const nextUser = createdUsers[(i + 1) % createdUsers.length];
      const prevUser = createdUsers[(i - 1 + createdUsers.length) % createdUsers.length];

      if (!user.following.includes(nextUser._id)) {
        user.following.push(nextUser._id);
        nextUser.followers.push(user._id);
      }
      if (!user.following.includes(prevUser._id)) {
        user.following.push(prevUser._id);
        prevUser.followers.push(user._id);
      }
      
      await user.save();
      await nextUser.save();
      await prevUser.save();
    }
    console.log('✅ Created follow relationships');

    // Create some posts for them
    const postTitles = [
      'Understanding React Hooks in 2026',
      'The Future of AI in Web Development',
      'Why CSS Grid is still awesome',
      'Building scalable microservices',
      '10 Tips for clean architecture',
      'Deploying apps faster with modern CI/CD',
      'My journey into data science'
    ];

    const createdPosts = [];

    for (let i = 0; i < createdUsers.length; i++) {
      const author = createdUsers[i];
      const post = await Post.create({
        title: postTitles[i],
        content: `This is an auto-generated post about **${postTitles[i]}**.\n\nIt contains some markdown like [links](https://example.com) and \`code snippets\`.\n\nEnjoy reading!`,
        tags: ['tech', 'programming', 'auto-generated'],
        category: 'Technology',
        author: author._id,
        status: 'published',
        coverImage: `https://picsum.photos/seed/${i}/800/400`
      });
      createdPosts.push(post);
      console.log(`Created post: ${post.title}`);
    }

    // Add some likes and comments
    for (let i = 0; i < createdPosts.length; i++) {
      const post = createdPosts[i];
      // The next user likes and comments on this post
      const commenter = createdUsers[(i + 1) % createdUsers.length];
      
      if (!post.likes.includes(commenter._id)) {
        post.likes.push(commenter._id);
        await post.save();
      }

      await Comment.create({
        post: post._id,
        author: commenter._id,
        content: `Great read! Really enjoyed learning about this topic. Thanks for sharing!`
      });
      
      post.commentsCount = 1;
      await post.save();
    }
    console.log('✅ Created posts, likes, and comments');

    console.log('🎉 Database seeding complete!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
