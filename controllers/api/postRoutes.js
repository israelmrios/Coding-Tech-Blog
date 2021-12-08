const router = require("express").Router();
const { Post } = require("../../models");
const withAuth = require("../../utils/auth");

router.post("/", withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Updates the Post and reloads the dashboard page
router.put("/:id", withAuth, async (req, res) => {
  try {
    const updatedPosts = await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      { where: { id: req.params.id } }
    );

    // Status 200 is not returned to client, it was because there were two res statements
    // res.render("dashboard", {
    //   updatedPosts,
    //   logged_in: true,
    // });
    res.status(200).json(updatedPosts);
  } catch (err) {
    res.status(400).json(err);
  }
});

// This route deletes a Post
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        post_id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    // Status 200 is not returned to client, it can be because of this if statement
    // if (!postData) {
    //   res.status(404).json({ message: "No post found with this id!" });
    //   return;
    // }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
