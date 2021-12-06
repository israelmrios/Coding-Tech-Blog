const router = require("express").Router();
const { Session } = require("express-session");
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");
const isOwned = require('../utils/owned');

router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

  res.render('home', { 
    posts,
    logged_in: req.session.logged_in })
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
        // {
        //   model: Comment,
        //   attributes: ['id', 'content', 'date_created', 'user_id', 'post_id'],
        // },
      ],
    });

    // const postData = await Post.findOne({
    //   where: { id: req.params.id },
    //   include: [
    //     User,
    //     {
    //       model: Comment,
    //       include: [User],
    //     },
    //   ],
    // });


    const post = postData.get({ plain: true }); 

    const commentsData = await Comment.findAll({
      where: {
        post_id: postId,
      },
      include: {
        model: User,
        attributes: ['username'],
      },
      // logged_in: {
      //   logged_in: req.session.logged_in,
      // },
    });

    const comments = commentsData.map((i) => i.get({ plain: true }));

    comments.map((i) => {
      if (i.user_id === req.session.user_id) {
        i.owned = true;
      }
    });

    // const test = Object.assign(...comments, req.session);
    console.log(comments);

    res.render('post', {
      ...post,
      comments,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/updatepost/:id", withAuth, async (req, res) => {
  try {
    // const postId = parseInt(req.params.id);
    // const postData = Post.findByPk(postId);
    // const post = postData.get({ plain: true });

    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const post = postData.get({ plain: true });
    
    res.render('updatepost', {
      ...post,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.get('/post/:id', async (req, res) => {
//   try {
//     const postId = parseInt(req.params.id);

//     const userData = await User.findAll({
//       attributes: { exclude: ['password'] },
//       order: [['username', 'ASC']],
//     });

//     const users = userData.map((i) => i.get({ plain: true }));

//     const commentsData = await Comment.findAll({
//       where: {
//         post_id: postId,
//       },
//     });
//     const comments = commentsData.map((i) => i.get({ plain: true }));

// console.log(comments);

//     const nameNames = (id) => {
//       for (let j = 0; j < users.length; j++) {
//         if (id === users[j].id) {
//           return users[j].username;
//         }
//       }
//     };

//     comments.map((i) => {
//       if (i.user_id === req.session.user_id) {
//         i.owned = true;
//       }
//       i.user_id = nameNames(i.user_id);
//     });

//     const postData = await Post.findByPk(postId);
//     const post = postData.get({ plain: true });
//     post.user_id = nameNames(post.user_id);
//     res.render('post', {
//       ...post,
//       ...comments,
//       logged_in: req.session.logged_in,
//       user_id: req.session.user_id,
//     });
//   } catch (err) {
//     throw err;
//   }
// });

// Use withAuth middleware to prevent access to route
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render("dashboard", {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }

  res.render("login");
});

router.get("/newpost", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render("newpost", {
      ...user,
      logged_in: true
    });    
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;
      // layout: 'dash'