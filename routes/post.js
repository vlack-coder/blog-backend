const router = require("express").Router();
const {
  createPost,
  deletePost,
  updatePost,
  getPost,
  getFeaturedPost,
  getPaginatedPost,
  getRelatedPosts,
  uploadImage,
} = require("../controllers/post");
const multer = require("../middleware/multer");
const { posstValidator, validate } = require("../middleware/postValidator");

router.post(
  "/create",
  multer.single("thumbnail"),
  (req, res, next) => {
    console.log("req", req.body);
    const { tags } = req.body;
    const { featured } = req.body;
    if (tags) {
      req.body.tags = JSON.parse(tags);
    }
    if (featured) {
      req.body.featured = JSON.parse(featured);
    }
    next();
  },
  posstValidator,
  validate,
  createPost
);
router.put(
  "/:postId",
  multer.single("thumbnail"),
  (req, res, next) => {
    console.log("req", req.body);
    const { tags } = req.body;
    const { featured } = req.body;
    if (tags) {
      req.body.tags = JSON.parse(tags);
    }
    if (featured) {
      req.body.featured = JSON.parse(featured);
    }
    next();
  },
  posstValidator,
  validate,
  updatePost
);

router.get("/singlepost/:postId", getPost);
router.get("/featured-posts", getFeaturedPost);
router.get("/posts", getPaginatedPost);
router.get("/posts", getPaginatedPost);
router.get("/related-posts/:postId", getRelatedPosts);


router.delete("/:postId", deletePost);


router.post(
    "/upload-image",
    multer.single("image"),
    uploadImage
  );

module.exports = router;
