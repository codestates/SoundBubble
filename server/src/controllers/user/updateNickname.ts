import { Request, Response, RequestHandler, NextFunction } from "express";
import { User } from "../../entity/User";
import { UserInfo } from "../../@type/userInfo";
import { checkNicknameFormat } from "../../utils/validate";
import hash from "../../utils/hash";
import { logError } from "../../utils/log";

const updateNickname: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const { userId }: { userId: number } = req.userInfo as UserInfo;
	const { nickname, password }: { nickname: string; password: string } = req.body;

	try {
		//* 파라미터 검사
		if (!nickname || !checkNicknameFormat(nickname)) {
			return res.status(400).json({ message: `Invalid nickname(body), input 'nickname: ${nickname}` });
		}

		//* 유저 조회: 인증 시 계정 확인됨
		const userInfo: User = (await User.findOne(userId)) as User;

		// 이메일 가입 or 통합 유저 (비밀번호 존재)
		if (userInfo.signUpType === "email" || userInfo.signUpType === "intergration") {
			if (!password) {
				return res.status(400).json({ message: "Invalid password(body)" });
			}

			const hashedPassword: string = hash(password);
			if (userInfo.password !== hashedPassword) {
				// 패스워드 다름
				return res.status(403).json({ message: "Incorrect password" });
			}
		}

		if (userInfo.nickname === nickname) {
			// 이전과 동일한 닉네임
			return res.status(409).json({ message: "Same nickname" });
		}
		const userUsingNickname: User | undefined = await User.findOne({ nickname });
		if (userUsingNickname) {
			// 중복된 닉네임
			return res.status(409).json({ message: "Nickname already in use" });
		}

		//* 닉네임 변경
		userInfo.nickname = nickname;
		await userInfo.save();

		return res.status(200).json({ data: { userInfo }, message: "User nickname successfully updated" });
	} catch (err) {
		logError("Failed to update nickname");
		next(err);
	}
};

export default updateNickname;
