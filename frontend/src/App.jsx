import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import BookList from "./pages/BookList.jsx";
import BookCreate from "./pages/BookCreate";
import BookDetail from "./pages/BookDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage";
import TestPage from './pages/TestPage';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/books" element={<BookList />} />
                <Route path="/books/detail" element={<BookDetail />} />
                <Route path="/books/new" element={<BookCreate />} />
                <Route path="/books/edit/:id" element={<BookCreate />} />  {/* 수정 모드 */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/mypage" element={<MyPage />} />
            </Routes>
        </Layout>
    );
}

export default App;