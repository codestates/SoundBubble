import { Request, Response, RequestHandler, NextFunction } from "express";
import { User } from "../../entity/User";
import { UserInfo } from "../../@type/userInfo";
import { checkPasswordFormat } from "../../utils/validate";
import hash from "../../utils/hash";
import { logError } from "../../utils/log";

const updatePassword: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	const { userId }: { userId: number } = req.userInfo as UserInfo;
	const { password, newPassword }: { password: string; newPassword: string } = req.body;

	try {
		//* 파라미터 검사
		if (!newPassword || !checkPasswordFormat(newPassword)) {
			return res.status(400).json({ message: "Invalid newPassword(body)" });
		}

		//* 유저 조회: 인증 시 계정 확인됨
		const userInfo: User = (await User.findOne(userId)) as User;

		//* (1) 이메일 가입 or 통합 유저 (기존 비밀번호 존재)
		if (userInfo.signUpType === "email" || userInfo.signUpType === "intergration") {
			if (!password) {
				return res.status(400).json({ message: "Invalid password(body)" });
			}

			const hashedPassword: string = hash(password);
			if (userInfo.password !== hashedPassword) {
				return res.status(403).json({ message: "Incorrect password" });
			}

			const hashedNewPassword = hash(newPassword);
			if (userInfo.password === hashedNewPassword) {
				// 이전과 동일한 비밀번호
				return res.status(409).json({ message: "Same password" });
			}

			// 비밀번호 변경
			userInfo.password = hashedNewPassword;
			await userInfo.save();
		}
		//* (2) 소셜 로그인으로 가입하고 아직 비빌번호를 변경하지 않은 유저
		else {
			const hashedNewPassword: string = hash(newPassword);
			userInfo.password = hashedNewPassword;
			userInfo.signUpType = "intergration";
			// 비밀번호 변경 -> 일반 로그인 사용 가능
			await userInfo.save();
		}

		const resUserInfo = await User.findUserByEmail(userInfo.email, userInfo.password);

		return res.status(200).json({ userInfo: resUserInfo , message: "User password successfully updated" });
	} catch (err) {
		logError("Failed to update password");
		next(err);
	}
};

export default updatePassword;
