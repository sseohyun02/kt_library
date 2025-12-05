import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import BookList from "./pages/BookList.jsx";  // ← 추가
import BookCreate from "./pages/BookCreate";
import BookDetail from "./pages/BookDetail";
import BookEdit from "./pages/BookEdit";


function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<h1>홈 페이지</h1>} />
                <Route path="/books" element={<BookList />} />
                <Route path="/books/:id" element={<BookDetail />} />
                <Route path="/books/new" element={<BookCreate />} />
                <Route path="/books/:id/edit" element={<BookEdit />} />
            </Routes>
        </Layout>
    );
}

export default App;
