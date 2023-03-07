const express = require('express');
const router = express.Router();
const Posts = require("../schemas/post.schema.js");
const Users = require("../schemas/user.schema.js");
const Comments = require("../schemas/comment.schema.js");
const authMiddleware = require("../middlewares/auth-middleware.js");

//게시글 작성 + 로그인 후 useId, nickname 정보
router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const {userId, nickname} = res.locals.user;
    const { title, content } = await req.body;

    if (!title || !content) {
      res.status(400).json({errorMessage: "데이터 형식이 올바르지 않습니다."});
      return;
    }

    await Posts.create({userId, nickname, title, content});
    return res.json({"message": "게시글을 생성하였습니다."});
  } catch (error) {
    return res.status(404).json({errorMessage: "게시글 작성에 실패하였습니다."});
  }
});

//게시글 전체 목록 조회, 시간기준 내림차순
router.get("/posts", async (req, res) => {
    try {
      const posts = await Posts.find({},{_id: 1, userId:1, nickname:1, title: 1, createdAt:1}).sort({createdAt: 'desc'}); 

      res.json({
        "data": posts
      });
    } catch (error) {
      res.status(404).json({errorMessage: "게시글 조회에 실패하였습니다."})
    }
  });

//게시글 상세 조회(파라미터값으로 찾기)
router.get("/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const posts = await Posts.find({_id: postId},{_id: 1, userId:1, nickname:1, title: 1, content:1, createdAt:1, updatedAt:1});

    res.json({
      "post": posts
    });
  } catch (error) {
    res.status(404).json({errorMessage: "게시글 조회에 실패하였습니다"})
  }
});

//게시글 수정 + 로그인 후 useId로 내가 작성한 것만 수정
router.put("/posts/:postId", authMiddleware, async(req, res) =>{
  try {
    const {postId} = req.params;
    const {userId} = res.locals.user;
    const {title, content} = req.body;
    const foundPost = await Posts.findOne({_id: postId});

    if (!title || !content) {
      res.status(400).json({errorMessage: "데이터 형식이 올바르지 않습니다."});
      return;
    }

    if(foundPost.userId === userId) {
      await Posts.updateOne(
        {_id: postId},
        {$set: {title :title, content: content}}
      );
      res.status(200).json({success:true, "message": "게시글을 수정하였습니다."});
    } else {
      res.status(404).json({errorMessage: "게시글 수정 권한이 없습니다."});
    }
  } catch (error) {
    res.status(404).json({errorMessage: "게시글 수정에 실패하였습니다."});
  }
});

//게시글 삭제 + 로그인 후 useId로 내가 작성한 것만 삭제
router.delete("/posts/:postId", authMiddleware, async(req, res) =>{
  try {
    const {postId} = req.params;
    const {userId} = res.locals.user;
    const foundPost = await Posts.findOne({_id: postId});

    if (!foundPost) {
      res.status(400).json({errorMessage: "게시글이 존재하지 않습니다."});
      return;
    }
    if(foundPost.userId === userId) {
      await Posts.deleteOne({_id: postId});
      res.status(200).json({success:true, "message": "게시글을 삭제하였습니다."});
    } else {
      res.status(404).json({errorMessage: "게시글 삭제 권한이 없습니다."});
    }
  } catch (error) {
    res.status(404).json({errorMessage: "게시글 삭제에 실패하였습니다."});
  }
});

//_id.toString(); 하면 안에 있는 값 내용만 문자열로 반환이 된다.
//findone으로 (user, pw, _id)이 값이 정확하게 같은 걸 찾도록
//delete는 퀴즈 답안 참고
//comments는 스키마를 내보내지 않고, 포스트 스키마로 가져와서 스키마 안에 넣어줘야함. comments: Comments 이런식으로 그러면 해당 포스트 안에 코멘트가 들어가게 됨, 배열로 쌓임

//댓글 작성 + 로그인 회원정보
router.post('/posts/:postId/comments', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, nickname } = res.locals.user;
    const { content } = await req.body;
    
    if (!content) {
       res.status(404).json({errorMessage: "댓글 내용을 입력해주세요."});
       return;
     }
    await Comments.create({ postId, userId, nickname, content});
    return res.json({success:true, "message": "댓글을 생성하였습니다."});
  } catch (error) {
    res.status(404).json({errorMessage: "댓글 작성에 실패하였습니다."});
  }
});

//댓글 목록 조회, 시간순으로 가져오기
router.get('/posts/:postId/comments', async (req, res) => {
  try {
      const { postId } = req.params;
      const commentList = await Comments.find({postId}).sort({createdAt: 'desc'}); 

      if (!commentList) {
        res.status(404).json({errorMessage: "게시글이 존재하지 않습니다."});
        return;
      }
      return res.json({
          "comments": commentList
      });
  } catch (error) {
    res.status(404).json({errorMessage: "댓글 조회에 실패하였습니다."})
  }
});

//댓글 수정
router.put("/posts/:postId/comments/:commentId", authMiddleware, async(req, res) =>{
  try {
    const {postId, commentId} = req.params;
    const {userId} = res.locals.user;
    const {content} = req.body;

    const foundComment = await Comments.findOne({postId, _id: commentId});

    if (!foundComment) {
      res.status(404).json({errorMessage: "게시글이 존재하지 않습니다."});
      return;
    } else if (!content) {
      res.status(404).json({errorMessage: "댓글 내용을 입력해주세요."});
      return;
    }

    if(foundComment.userId === userId) {
      await Comments.updateOne(
        {_id: commentId},
        {$set: {content: content}}
      );
      res.status(200).json({success:true, "message": "댓글을 수정하였습니다."});
    } else {
      res.status(404).json({errorMessage: "댓글 수정권한이 없습니다."});
    }
  } catch (error) {
    res.status(404).json({errorMessage: "댓글 수정에 실패하였습니다."});
  }
});

//댓글 삭제
router.delete("/posts/:postId/comments/:commentId", authMiddleware, async(req, res) =>{
  try {
    const {postId, commentId} = req.params;
    const {userId} = res.locals.user;

    const foundComment = await Comments.findOne({_id: commentId});

    if(foundComment.userId === userId) {
      await Comments.deleteOne({_id: commentId});
      res.status(200).json({success:true, "message": "댓글을 삭제하였습니다."});
    } else {
      res.status(404).json({errorMessage: "댓글 삭제 권한이 없습니다."});
    }
  } catch (error) {
    res.status(404).json({errorMessage: "댓글 삭제에 실패하였습니다."});
  }
});

module.exports = router;