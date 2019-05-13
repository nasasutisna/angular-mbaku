declare interface loginInfo<T> {
	msg: string;
	user: { userInfo: T, userStatus: any };
	isLogin: any;
}