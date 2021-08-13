import { Request, Response, RequestHandler } from "express";
import { Bubble } from "../../entity/Bubble";
import { BubbleComment } from "../../entity/BubbleComment";
import { UserInfo } from "../../@type/tokenUserInfo";

const createBubbleComment: RequestHandler = async (req: Request, res: Response) => {
  const { userId }: { userId: number } = req.userInfo as UserInfo;
  const { id: bubbleId }: { id: string } = req.params as any;
  const { textContent }: { textContent: string | undefined } = req.body;

  try {
    //* 파라미터 검사
    if (!textContent) {
      return res.status(400).json({ message: `Invalid textContent(body), input 'textContent': ${textContent}` });
    }

    //* 버블 조회. 존재하는 버블인지 확인
    const bubbleInfo: Bubble | undefined = await Bubble.findOne(bubbleId);

    if (!bubbleInfo) {
      return res.status(404).json({ message: "Bubble not found" });
    }

    //* 댓글 입력
    await BubbleComment.insertComment(userId, Number(bubbleId), textContent);

    //* 갱신된 댓글 목록 조회
    const comments: BubbleComment[] = await BubbleComment.findComments(Number(bubbleId));

    res.status(201).json({ data: { comments }, message: "Comment successfully registered" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to register comment" });
  }
};

export default createBubbleComment;
