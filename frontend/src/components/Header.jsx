export default function Header() {
    return (
        <header className="w-full flex items-center justify-between px-10 py-4 shadow-sm bg-white">

            {/* 로고 + 텍스트 */}
            <div className="flex items-center gap-3">
                <img src="/logo.png" alt="logo" className="w-10 h-10"/>
                <span className="text-xl font-bold">작가의 산책</span>
            </div>

            {/* 메뉴 */}
            <nav className="flex items-center gap-10 text-lg">
                <a className="cursor-pointer hover:font-bold">내 서재</a>
                <a className="cursor-pointer hover:font-bold">관리</a>
                <a className="cursor-pointer hover:font-bold">관심</a>
            </nav>

            {/* 검색 + 로그인 */}
            <div className="flex items-center gap-4">
                <input
                    type="text"
                    placeholder="도서 검색"
                    className="border px-4 py-2 rounded-lg w-60"
                />
                <button className="px-5 py-2 bg-blue-600 text-white rounded-lg">
                    로그인
                </button>
            </div>

        </header>
    );
}
